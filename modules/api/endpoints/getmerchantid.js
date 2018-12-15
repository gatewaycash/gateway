/**
 * GET /getmerchantid API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /getmerchantid
 */
const mysql = require('mysql')
const url = require('url')

module.exports = function (req, res) {
  console.log('/getmerchantid requested')

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

      // send the response to the user
      } else {
        response.status = 'success'
        response.merchantID = result[0].merchantID
        res.end(JSON.stringify(response))
      }
    })
  }
}
