/**
 * GET /newapikey API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /newapikey
 */
const mysql = require('mysql')
const url = require('url')
const sha256 = require('sha256')

module.exports = function (req, res) {
  console.log('/newapikey requested')

  // parse the provided data
  const query = url.parse(req.url, true).query
  console.log(query)

  // define a response object
  const response = {}

  // verify the API key was provided
  if (!query.APIKey) {
    response.status = 'error'
    response.error = 'No API Key'
    response.description = 'An API Key is required for this endpoint.'
    res.end(JSON.stringify(response))

  // search for and update the record
  } else {
    // connect to the database
    const conn = mysql.createConnection({
      host: process.env.SQL_DATABASE_HOST,
      user: process.env.SQL_DATABASE_USER,
      password: process.env.SQL_DATABASE_PASSWORD,
      database: process.env.SQL_DATABASE_DB_NAME,
    })
    var sql = `select APIKey
      from users
      where
      APIKey = ?
      limit 1`
    conn.query(sql, [query.APIKey], (err, result) => {
      if (err) {
        throw err
      }

      // fail unless there is exactly 1 record
      if (result.length !== 1) {
        response.status = 'error'
        response.error = 'Invalid API Key'
        response.description = `No user currently has that API key. You might
          have changed your API key in your account settings, or the API key
          might be invalid.`
        res.end(JSON.stringify(response))

      // update the API key
      } else {
        var sql = `update users
          set APIKey = ?
          where
          APIKey = ?`
        const newAPIKey = sha256(require('crypto').randomBytes(32))
        conn.query(sql, [newAPIKey, query.APIKey], (err, result) => {
          if (err) {
            throw err
          }

          // send the success message to the user
          response.status = 'success'
          response.newAPIKey = newAPIKey
          res.end(JSON.stringify(response))
        })
      }
    })
  }
}
