module.exports = function (options) {
  return (req, res) => {
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
          var paymentAddress = bch.HDNode.toCashAddress(
            hdNode
          ).toString()
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
              // must fail silently here if we are to
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
            (
              paymentAddress,
              paymentKey,
              merchantID,
              paymentID,
              callbackURL
            )
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
  }
}
