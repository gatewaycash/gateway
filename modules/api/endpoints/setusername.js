/**
 * POST /setusername API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a POST endpoint for /setusername
 */
const mysql = require('mysql')

module.exports = function (req, res) {
  console.log('/getusername requested')
  console.log(req.body)

  // an object to hold the response
  const response = {}

  // verify the API key was provided
  if (!req.body.APIKey) {
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
    var sql = 'select username from users where APIKey = ? limit 1'
    conn.query(sql, [req.body.APIKey], (err, result) => {
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

      // verify username was provided
      } else {
        if (!req.body.username) {
          response.status = 'error'
          response.error = 'No Username Provided'
          response.description = `Please provide a new username!`
          res.end(JSON.stringify(response))

        // verify new username is not too short
        } else if (req.body.username.length < 5) {
          response.status = 'error'
          response.error = 'Username Too Short'
          response.description = `Username must be at least 5 characters!`
          res.end(JSON.stringify(response))

        // verify new username is not too long
        } else if (req.body.username.length > 24) {
          response.status = 'error'
          response.error = 'Username Too Long'
          response.description = `Username can be at most 24 characters!`
          res.end(JSON.stringify(response))

        // verify username does not contain special characters
        } else if (
          req.body.username.indexOf(' ') !== -1 ||
          req.body.username.indexOf('\n') !== -1 ||
          req.body.username.indexOf('\t') !== -1 ||
          req.body.username.indexOf('!') !== -1 ||
          req.body.username.indexOf('@') !== -1 ||
          req.body.username.indexOf('#') !== -1 ||
          req.body.username.indexOf('$') !== -1 ||
          req.body.username.indexOf('%') !== -1 ||
          req.body.username.indexOf('^') !== -1 ||
          req.body.username.indexOf('&') !== -1 ||
          req.body.username.indexOf('*') !== -1 ||
          req.body.username.indexOf('()') !== -1 ||
          req.body.username.indexOf(')') !== -1 ||
          req.body.username.indexOf('|') !== -1 ||
          req.body.username.indexOf('\\') !== -1 ||
          req.body.username.indexOf('/') !== -1 ||
          req.body.username.indexOf('?') !== -1 ||
          req.body.username.indexOf('<') !== -1 ||
          req.body.username.indexOf('>') !== -1 ||
          req.body.username.indexOf('{') !== -1 ||
          req.body.username.indexOf('}') !== -1 ||
          req.body.username.indexOf('[') !== -1 ||
          req.body.username.indexOf(']') !== -1 ||
          req.body.username.indexOf(';') !== -1
        ) {
          response.status = 'error'
          response.error = 'No Special Characters'
          response.description = `Usernames cannot contain special characters!`
          res.end(JSON.stringify(response))

        // verify username is not in use
        } else {
          var sql = 'select username from users where username like ? limit 1'
          conn.query(sql, [req.body.username], (err, result) => {
            if (err) {
              throw err
            }

            // fail unless there are no matches
            if (result.length > 0) {
              response.status = 'error'
              response.error = 'Username In Use'
              response.description = `That username is already in use! Try
                another?`
              res.end(JSON.stringify(response))

            // update the username
            } else {
              var sql = `update users
                set username = ?
                where
                APIKey = ?`
              conn.query(
                sql,
                [req.body.username.toString().toLowerCase(), req.body.APIKey],
                (err, result) => {
                  if (err) {
                    throw err
                  }

                  // send success message to user
                  response.status = 'success'
                  response.username = req.body.username.toString().toLowerCase()
                  res.end(JSON.stringify(response))
                }
              )
            }
          })
        }
      }
    })
  }
}
