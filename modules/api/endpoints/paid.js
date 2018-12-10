module.exports = function (options) {
  return (req, res) => {
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
                // verify txid doesn't exist in payments tabble
                var sql = `select paymentTXID from payments
                  where
                  paymentTXID = ?
                  or
                  transferTXID = ?`
                conn.query(
                  sql,
                  [query.txid, query.txid],
                  (err, result) => {
                  if (err) {
                    throw err
                  }
                  if (result.length !== 0) {
                    res.send('TXID already paid')
                  } else {
                    // verify the address is in the database
                    var sql = `select paymentAddress
                      from payments
                      where
                      paymentAddress = ?`
                    conn.query(
                      sql,
                      [query.address],
                      (err, result) => {
                      if (err) {
                        throw err
                      }
                      if (result.length !== 1) {
                        res.send('Address not found')
                      } else {
                        // insert into pending
                        var sql = `insert into pending
                          (address, txid)
                          values
                          (?, ?)`
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
  }
}
