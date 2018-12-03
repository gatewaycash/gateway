/**
 * Gateway Server
 * @author Ty Everett <ty@tyweb.us>
 * @file Defines the entry point for the Gateway web server
 */

/*

ABOUT THIS FILE

This file is in the process of being deprecated and modularized.
For those working on this process, please use register.js as a guide
for how to take one of these sections and modularize it into it's 
own file. This will make things more easy to manage long-term.

*/

app.get('/api/pay', (req, res) => {
  const query = url.parse(req.url, true).query
  if (!query.merchantID || !query.paymentID) {
    res.send('MerchantID and PaymentID not provided!')
  } else if (query.merchantID.length !== 16) {
    res.send('Invalid MerchantID')
  } else if (query.paymentID.length > 32) {
    res.send('PaymentID cannot be longer than 32 characters')
  } else {
    // initial checks pased, verify merchantID exists
    var sql = 'select merchantID from users where merchantID = ?'
    conn.query(sql, [query.merchantID], (err, result) => {
      if (result.length !== 1) {
        res.send('Invalid MerchantID')
      } else {
        // generate a new address and private key
        var mnemonic = bch.Mnemonic.generate(128)
        var seedBuffer = bch.Mnemonic.toSeed(mnemonic)
        var hdNode = bch.HDNode.fromSeed(seedBuffer)
        var paymentPrivateKey = bch.HDNode.toWIF(hdNode).toString()
        var paymentAddress = bch.HDNode.toCashAddress(hdNode).toString()
        if (paymentAddress.indexOf(':') === -1) {
          paymentAddress = 'bitcoincash:' + paymentAddress
        }
        var callbackURL = query.callbackURL
        if (callbackURL) {
          if (
            !callbackURL.toString().startsWith('http://') &&
            !callbackURL.toString().startsWith('https://')
          ) {
            callbackURL = 'None'
            // we must fail silently here without sending error if we are to
            // continue processing the payment at all
          } else if (
            callbackURL.toString().length > 128 ||
            callbackURL.toString().length < 10
          ) {
            callbackURL = 'None'
          }
        } else {
          callbackURL = 'None'
        }
        // generate a payment and add it to database
        var sql = `insert into payments
        (paymentAddress, paymentKey, merchantID, paymentID, callbackURL)
        values
        (?, ?, ?, ?, ?)`
        conn.query(
          sql,
          [
            paymentAddress,
            paymentPrivateKey,
            query.merchantID,
            query.paymentID,
            callbackURL,
          ],
          (err, result) => {
            if (err) {
              throw err
            }
            res.send(paymentAddress)
          },
        )
      }
    })
  }
})

app.get('/api/paymentsent', (req, res) => {
  const query = url.parse(req.url, true).query
  // validate the address
  if (query.address.toString().indexOf(':') === -1) {
    res.send('Invalid address')
  } else {
    try {
      if (bch.Address.isCashAddress(query.address)) {
        // verify txid is of correct length
        if (query.txid.length !== 64) {
          res.send('Invalid TXID')
        } else {
          // verify txid does not already exist in pending table
          var sql = 'select txid from pending where txid = ?'
          conn.query(sql, [query.txid], (err, result) => {
            if (err) {
              throw err
            }
            if (result.length !== 0) {
              res.send('TXID is already pending')
            } else {
              // verify txid does not already exist in payments table
              var sql = `select paymentTXID from payments
              where
              paymentTXID = ?
              or
              transferTXID = ?`
              conn.query(sql, [query.txid, query.txid], (err, result) => {
                if (err) {
                  throw err
                }
                if (result.length !== 0) {
                  res.send('TXID already paid')
                } else {
                  // verify the address is in the database
                  var sql =
                    'select paymentAddress from payments where paymentAddress = ?'
                  conn.query(sql, [query.address], (err, result) => {
                    if (err) {
                      throw err
                    }
                    if (result.length !== 1) {
                      res.send('Address not found')
                    } else {
                      // insert into pending
                      var sql =
                        'insert into pending (address, txid) values (?, ?)'
                      conn.query(
                        sql,
                        [query.address, query.txid],
                        (err, result) => {
                          if (err) {
                            throw err
                          }
                          res.send('ok')
                        },
                      )
                    }
                  })
                }
              })
            }
          })
        }
      }
    } catch (e) {
      res.send('Invalid address')
    }
  }
})

app.get('/api/getmerchantid', (req, res) => {
  if (!req.session.loggedIn) {
    res.send('Please log in first')
  } else {
    res.send(req.session.merchantID)
  }
})

app.get('/api/getusername', (req, res) => {
  if (!req.session.loggedIn) {
    res.send('Please log in first')
  } else {
    var sql = 'select username from users where merchantID = ?'
    conn.query(sql, [req.session.merchantID], (err, result) => {
      res.send(result[0].username)
    })
  }
})

app.post('/api/setusername', (req, res) => {
  const query = url.parse(req.url, true).query
  if (!req.session.loggedIn) {
    res.send('Please log in first')
  } else {
    var usernameCandidate = req.body.username.toString()
    if (usernameCandidate.length < 5) {
      res.send('Pick a longer username.')
    } else if (usernameCandidate.indexOf(' ') !== -1) {
      res.send('Usernames cannot contain spaces')
    } else {
      conn.qpery(sql, [usernameCandidate], (err, result) => {
        if (err) {
          throw err
        }
        if (result.length !== 0) {
          res.send('Username is already in use')
        } else {
          var sql = 'update users set username = ? where payoutAddress = ?'
          conn.query(
            sql,
            [usernameCandidate, req.session.address],
            (err, result) => {
              if (err) {
                throw err
              }
              res.send('ok')
            },
          )
        }
      })
    }
  }
})

app.get('/api/getpayments', (req, res) => {
  if (!req.session.loggedIn) {
    res.send('Log in first')
  } else {
    var sql = `select
    paymentAddress, created, paymentID, paidAmount, paymentTXID, transferTXID
    from payments where
    merchantID = ?
    and
    transferTXID is not null
    order by created desc
    limit 100`
    conn.query(sql, [req.session.merchantID], (err, result) => {
      if (err) {
        throw err
      }
      var response = []
      for (var i = 0; i < result.length; i++) {
        response.push(result[i])
      }
      res.send(response)
    })
  }
})

app.get('/api/getunpaidpayments', (req, res) => {
  if (!req.session.loggedIn) {
    res.send('log in first')
  } else {
    var sql =
      'select paymentAddress, created, paymentID, paidAmount, paymentTXID, transferTXID from payments where merchantID = ? order by created desc limit 100'
    conn.query(sql, [req.session.merchantID], (err, result) => {
      if (err) {
        throw err
      }
      var response = []
      for (var i = 0; i < result.length; i++) {
        response.push(result[i])
      }
      res.send(response)
    })
  }
})

app.get('/api/loggedin', (req, res) => {
  if (req.session.loggedIn) {
    res.send('true')
  } else {
    res.send('false')
  }
})
