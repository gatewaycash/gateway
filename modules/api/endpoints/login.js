/**
 * GET /login API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines the /login API endpoint
 */
const url = require('url')
const bchaddr = require('bchaddrjs')
const mysql = require('mysql')
const sha256 = require('sha256')
require('dotenv').config()

module.exports = function (req, res) {
  console.log('/login requested')

  // parse the provided data
  const query = url.parse(req.url, true).query
  console.log(query)

  // define a response object
  const response = {}

  // ensure a password was sent
  if (!query.password) {
    response.status = 'error'
    response.error = 'No Password',
    response.description = 'Provide a password when logging in'
    res.end(JSON.stringify(response))

  // verify that either an address or a username was provided
  } else if (!query.address && !query.username) {
    response.status = 'error'
    response.error = 'Address or Username Required',
    response.description = 'An address or a username is required to log in.'
    res.end(JSON.stringify(response))

  /*
    Since we prefer to log in with an address (when both an address and a
    username were provided), we check for an address first.
  */
  } else if (query.address) {

    // connect to the database
    const conn = mysql.createConnection({
      host: process.env.SQL_DATABASE_HOST,
      user: process.env.SQL_DATABASE_USER,
      password: process.env.SQL_DATABASE_PASSWORD,
      database: process.env.SQL_DATABASE_DB_NAME,
    })

    // search the database for records
    var sql = `select password, salt, APIKey
      from users
      where
      payoutAddress = ?
      limit 1`
    conn.query(sql, [query.address], (err, result) => {
      if (err) {
        throw err
      }

      // Fail unless the query returned exactly one record
      if (result.length !== 1) {
        response.status = 'error'
        response.error = 'Invalid Login',
        response.description = 'An incorrect address or password was given.'
        res.end(JSON.stringify(response))

      // validate the password
      } else {
        const user = result[0]
        const passwordHash = sha256(query.password + user.salt)

        // send the API key if the password matches
        if (user.password === passwordHash) {
          response.status = 'success'
          response.APIKey = user.APIKey,
          res.end(JSON.stringify(response))

        // in all other cases, fail with invalid login
        } else {
          response.status = 'error'
          response.error = 'Invalid Login',
          response.description = 'An incorrect address or password was given.'
          res.end(JSON.stringify(response))
        }
      }
    })

  /*
    Try searching for the user by username only when the address was not
    provided.
   */
  } else {

    // connect to the database
    const conn = mysql.createConnection({
      host: process.env.SQL_DATABASE_HOST,
      user: process.env.SQL_DATABASE_USER,
      password: process.env.SQL_DATABASE_PASSWORD,
      database: process.env.SQL_DATABASE_DB_NAME,
    })

    // search for records
    var sql = `select password, salt, APIKey
      from users
      where
      username = ?
      limit 1`
    conn.query(sql, [query.username], (err, result) => {
      if (err) {
        throw err
      }

      // fail unless there is exactly one match
      if (result.length !== 1) {
        response.status = 'error'
        response.error = 'Invalid Login',
        response.description = 'An incorrect username or password was given.'
        res.end(JSON.stringify(response))

      // validate the password
      } else {
        var user = result[0]
        var passwordHash = sha256(query.password + user.salt)

        // send the API key if the password matches
        if (user.password === passwordHash) {
          response.status = 'success'
          response.APIKey = user.APIKey,
          res.end(JSON.stringify(response))

        // in all other cases, fail with invalid login
        } else {
          response.status = 'error'
          response.error = 'Invalid Login',
          response.description = 'An incorrect username or password was given.'
          res.end(JSON.stringify(response))
        }
      }
    })
  }
}
