/**
 * POST /pay API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a POST endpoint for /pay
 */
const mysql = require('mysql')
const bch = require('bitcore-lib-cash')
module.exports = function (req, res) {
  console.log('/pay requested')
  console.log(req.body)

  // an object to hold the response
  const response = {}

  // ensure a merchant ID was given
  if (!req.body.merchantID) {
    response.status = 'error'
    response.error = 'No Merchant ID Given'
    response.description = `A merchant ID is required in order to generate the
      payment invoice. This is because Gateway needs to know where to send the
      funds once we receive then.`
    res.end(JSON.stringify(response))

  // make sure the merchant ID is in the database
  } else {

    // connect to the database
    const conn = mysql.createConnection({
      host: process.env.SQL_DATABASE_HOST,
      user: process.env.SQL_DATABASE_USER,
      password: process.env.SQL_DATABASE_PASSWORD,
      database: process.env.SQL_DATABASE_DB_NAME,
    })

    var sql = `select merchantID
      from users
      where
      merchantID = ?
      limit 1`
    conn.query(sql, [req.body.merchantID], (err, result) => {
      if (err) {
        throw err
      }

      // fail unless there is exactly 1 result
      if (result.length !== 1) {
        response.status = 'error'
        response.error = 'Merchant ID Not Found'
        response.description = `The merchant ID you provided wasn't found in
          the database. Make sure you're sending the correct merchant ID.`
        res.end(JSON.stringify(response))

      /*
        There are four possible outcomes here:
        - merchantID only
        - merchantID and paymentID
        - merchantID and callbackURL
        - merchantID, paymentID and callbackURL

        We need to find out out if we need to do four
        separate queries or not.
       */

      } else {



      }
    })
  }


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
