/**
 * GET /login API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /login
 */
const url = require('url')
const sha256 = require('sha256')
const mysql = require('../../SQLWrapper')

module.exports = async function (req, res) {
  console.log('GET /login requested')

  // parse the provided data
  const query = url.parse(req.url, true).query

  // define a response object
  const response = {}

  // ensure a password was sent
  if (!query.password) {
    response.status = 'error'
    response.error = 'No Password',
    response.description = 'Provide a password when logging in'
    res.end(JSON.stringify(response))
    return
  }

  // verify that either an address or a username was provided
  if (!query.address && !query.username) {
    response.status = 'error'
    response.error = 'Address or Username Required',
    response.description = 'An address or a username is required to log in.'
    res.end(JSON.stringify(response))
    return
  }

  /*
    Since we prefer to log in with an address (when both an address and a
    username were provided), we try searching for an address first.
  */
  if (query.address) {

    // search the database for records
    let sql = `select password, salt, APIKey
      from users
      where
      payoutAddress = ?
      limit 1`
    let result = await mysql.query(sql, [query.address])

    // Fail unless the query returned exactly one record
    if (result.length !== 1) {
      response.status = 'error'
      response.error = 'Invalid Login',
      response.description = 'An incorrect address or password was given.'
      res.end(JSON.stringify(response))
      return
    }

    // validate the password
    const user = result[0]
    const passwordHash = sha256(query.password + user.salt)
    // send the API key if the password matches

    if (user.password === passwordHash) {
      response.status = 'success'
      response.APIKey = user.APIKey,
      res.end(JSON.stringify(response))
      return
    }

    // in all other cases, fail with invalid login
    response.status = 'error'
    response.error = 'Invalid Login',
    response.description = 'An incorrect address or password was given.'
    res.end(JSON.stringify(response))

  /*
    Try searching for the user by username only when the address was not
    provided.
   */
  } else {

    // search for records
    let sql = `select password, salt, APIKey
      from users
      where
      username = ?
      limit 1`
    let result = await mysql.query(sql, [query.username])

    // fail unless there is exactly one match
    if (result.length !== 1) {
      response.status = 'error'
      response.error = 'Invalid Login',
      response.description = 'An incorrect username or password was given.'
      res.end(JSON.stringify(response))
      return
    }

    // validate the password
    var user = result[0]
    var passwordHash = sha256(query.password + user.salt)

    // send the API key if the password matches
    if (user.password === passwordHash) {
      response.status = 'success'
      response.APIKey = user.APIKey,
      res.end(JSON.stringify(response))
      return
    }

    // in all other cases, fail with invalid login
    response.status = 'error'
    response.error = 'Invalid Login',
    response.description = 'An incorrect username or password was given.'
    res.end(JSON.stringify(response))
  }
}
