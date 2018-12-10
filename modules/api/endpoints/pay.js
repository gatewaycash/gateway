/**
 * POST /pay API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a POST endpoint for /pay
 */
const mysql = require('mysql')
const bch = require('bitcore-lib-cash')
const bchaddr = require('bchaddrjs')
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

      // define variables for callback URL and payment ID
      } else {
        const callbackURL = req.body.callbackURL ? req.body.callbackURL : false
        const paymentID = req.body.paymentID ? req.body.paymentID : false

        // make sure callback URL is not too long
        if (callbackURL && callbackURL.length > 250) {
          response.status = 'error'
          response.error = 'Callback URL too long'
          response.description = `The maximum length of a callback URL is 250
            characters. Please find a way to shorten your callback URL, or
            consider using a URL shortening service.`
          res.end(JSON.stringify(response))

        // check some basic aspects of the callback URL for validity.
        } else if (
          callbackURL &&
          (
            (
              callbackURL.indexOf('http://') !== 0 &&
              callbackURL.indexOf('https://') !== 0
            ) ||
            callbackURL.indexOf('.') === -1 ||
            callbackURL.length < 10
          )
        ) {
          response.status = 'error'
          response.error = 'Callback URL is not valid'
          response.description = `Please check the callback URL you provided
            and make sure it is valid. Ensure it starts with http:// or https://
            and that it resolves to a reachable server.`
          res.end(JSON.stringify(response))

        // verify the payment ID is not too long
        } else if (paymentID && paymentID.length > 64) {
          response.status = 'error'
          response.error = 'Payment ID is too long'
          response.description = `Payment IDs are used for distinguishing one
            payment from another. The maximum length of a payment ID is 64
            characters. Please shorten your payment ID.`
          res.end(JSON.stringify(response))

        // generate the new address
        } else {
          const privateKey = new bch.PrivateKey()
          const paymentKey = privateKey.toWIF()
          const paymentAddress = bchaddr.toCashAddress(
            privateKey.toAddress().toString()
          )

          // insert the record into the database
          var sql = `insert into payments
            (
              merchantID,
              paymentID,
              paymentAddress,
              paymentKey,
              callbackURL
            )
            values
            (?, ?, ?, ?, ?)`
          conn.query(
            sql,
            [
              req.body.merchantID,
              paymentID,
              paymentAddress,
              paymentKey,
              callbackURL
            ],
            (err, result) => {
              if (err) {
                throw err
              }

              // send the payment address to the user
              response.status = 'success'
              response.paymentAddress = paymentAddress
              res.end(JSON.stringify(response))
            }
          )
        }
      }
    })
  }
}
