/**
 * POST /paid API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file defines a POST endpoint for /paid
 */
const mysql = require('mysql')
const bchaddr = require('bchaddrjs')
module.exports = function (req, res) {
  console.log('/paid requested')
  console.log(req.body)

  // na object to hold the response
  const response = {}

  // verify a payment address was provided
  if (!req.body.paymentAddress) {
    response.status = 'error'
    response.error = 'No Payment Address'
    response.description = `Please send back the payment address you received
      when you called /pay so we know which payment you are marking as paid.`
    res.end(JSON.stringify(response))

  // verify a Payment TXID was provided
  } else if (!req.body.paymentTXID) {
    response.status = 'error'
    response.error = 'No Payment TXID'
    response.description = `Please provide the TXID of the transaction which
      sends funds to the payment address.`
    res.end(JSON.stringify(response))

  // verify the TXID is the correct length
  } else if (req.body.paymentTXID.length !== 64) {
    response.status = 'error'
    response.error = 'Invalid Payment TXID'
    response.description = `The TXID you provided is invalid. Check that the
      payment TXID is correct.`
    res.end(JSON.stringify(response))

  // verify the provided address is valid
  } else {
    var address = req.body.paymentAddress
    try {
      address = bchaddr.toCashAddress(address)
    } catch (e) {
      address = 'invalid'
    }
    if (address === 'invalid') {
      response.status = 'error'
      response.error = 'Invalid Payment Address'
      response.description = `Make sure the payment address you provided is
        valid!`
      res.end(JSON.stringify(response))

    // verify the given address is in the payments table
    } else {

      // connect to the database
      const conn = mysql.createConnection({
        host: process.env.SQL_DATABASE_HOST,
        user: process.env.SQL_DATABASE_USER,
        password: process.env.SQL_DATABASE_PASSWORD,
        database: process.env.SQL_DATABASE_DB_NAME,
      })
      var sql = `select paymentAddress
        from payments
        where
        paymentAddress = ?`
      conn.query(sql, [address], (err, result) => {
        if (err) {
          throw err
        }

        // fail unless there is at least 1 record
        if (result.length < 1) {
          response.status = 'error'
          response.error = 'Payment Address Error'
          response.description = `The payment address you provided is not in
            the database`
          res.end(JSON.stringify(response))

        // verify the TXID is not already pending
        } else {
          var sql = `select paymentTXID
            from pending
            where
            paymentTXID = ?`
          conn.query(sql, [req.body.paymentTXID], (err, result) => {
            if (err) {
              throw err
            }

            // fail unless there are no results
            if (result.length > 0) {
              response.status = 'error'
              response.error = 'Transaction Already Pending'
              response.description = `This transaction is already pending!`
              res.end(JSON.stringify(response))

            // verify this TXID is not in the payments table
            } else {
              var sql = `select paymentTXID
                from payments
                where
                paymentTXID = ?
                or
                transferTXID = ?`
              conn.query(
                sql,
                [req.body.paymentTXID, req.body.paymentTXID],
                (err, result) => {
                  if (err) {
                    throw err
                  }

                  // fail if the tXID already exists
                  if (result.length !== 0) {
                    response.status = 'error'
                    response.error = 'TXID Already Exists'
                    response.description = `This tXID is already associated
                      with a payment. Your payment might already have been
                      processed and sent to a merchant, or you might be sending
                      a TXID from a previous transaction.`
                    res.end(JSON.stringify(response))

                  // all checks passed, insert this record into pending payments
                  } else {
                    var sql = `insert into pending
                      (address, txid)
                      values
                      (?, ?)`
                    conn.query(
                      sql,
                      [req.body.paymentAddress, req.body.paymentTXID],
                      (err, result) => {
                        if (err) {
                          throw err
                        }

                        // send back a success message
                        response.status = 'success'
                        res.end(JSON.stringify(response))
                      }
                    )
                  }
                }
              )
            }
          })
        }
      })
    }
  }
}
