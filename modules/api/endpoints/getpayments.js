/**
 * GET /getpayments API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /getpayments
 */
const mysql = require('mysql')
const url = require('url')

module.exports = function (req, res) {
  console.log('/getpayments requested')

  // parse the provided data
  const query = url.parse(req.url, true).query
  console.log(query)

  // an object to hold the response
  const response = {}

  // verify the API key was provided
  if (!query.APIKey) {
    response.status = 'error'
    response.error = 'No API Key'
    response.description = 'An API Key is required for this endpoint.'
    res.end(JSON.stringify(response))

  // search the database for the record
  } else {

    // connect to the database
    const conn = mysql.createConnection({
      host: process.env.SQL_DATABASE_HOST,
      user: process.env.SQL_DATABASE_USER,
      password: process.env.SQL_DATABASE_PASSWORD,
      database: process.env.SQL_DATABASE_DB_NAME,
    })
    var sql = 'select merchantID from users where APIKey = ? limit 1'
    conn.query(sql, [query.APIKey], (err, result) => {
      if (err) {
        throw err
      }

      // fail unless there is exactly 1 record
      if (result.length !== 1) {
        response.status = 'error'
        response.error = 'Invalid API Key'
        response.description = 'No user currently has that API key. You might have changed your API key in your account settings, or the API key might be invalid.'
        res.end(JSON.stringify(response))

      // search for all complete payments to this merchant ID
      } else {
        const merchantID = result[0].merchantID

        /*
          TODO:

          We need a way of giving a limit on the number of records to return
          (and setting one by default). We need to return the first 50
          records and indicate to the user which page of records they are on.
          The user needs to be able to specify "pageNumber" and "pageSize"
          (within reason) for the records they are requesting.

          For example, given a pageSize of 50 and a pageNumber of 1, records
          1-50 are returned. For pageNumber 2, records 51-100 are returned.
         */


        var sql = `select
          paymentAddress,
          paidAmount,
          paymentTXID,
          transferTXID,
          paymentID,
          created,
          paymentKey
          from payments
          where
          merchantID = ?
          and
          transferTXID is not null
          order by created
          desc`
        conn.query(sql, [merchantID], (err, result) => {
          if (err) {
            throw err
          }

          // fail if there are no results
          if (result.length < 1) {
            response.status = 'error'
            response.error = 'No Results'
            response.description = 'No payments have been completed to this merchant yet. Make a test payment with /pay and see what happens!'
            res.end(JSON.stringify(response))

          // send the payments to the user
          } else {
            response.status = 'success'
            response.numberOfPayments = result.length
            response.payments = result

            // hide the private keys unless includeKeys is YES
            const hideKeys = (!query.includeKeys || query.includeKeys !== 'YES')
            for (var i = 0; hideKeys && i < response.numberOfPayments; i++) {
              if (hideKeys) {
                response.payments[i].paymentKey = 'hidden'
              }
            }
            res.end(JSON.stringify(response))
          }
        })
      }
    })
  }
}
