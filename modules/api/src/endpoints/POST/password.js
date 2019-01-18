/**
 * POST /password API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a POST endpoint for /password
 */
const mysql = require('../../SQLWrapper')
const sha256 = require('sha256')

module.exports = async function (req, res) {
  console.log('POST /password requested')

  // an object to hold the response
  const response = {}

  // verify the API key was provided
  if (!req.body.APIKey) {
    response.status = 'error'
    response.error = 'No API Key'
    response.description = 'An API Key is required for this endpoint.'
    res.end(JSON.stringify(response))
    return
  }

  // search the database for the record
  let sql = 'select APIKey from users where APIKey = ? limit 1'
  let result = await mysql.query(sql, [req.body.APIKey])

  // fail unless there is exactly 1 record
  if (result.length !== 1) {
    response.status = 'error'
    response.error = 'Invalid API Key'
    response.description = 'No user currently has that API key. You might have changed your API key in your account settings, or the API key might be invalid.'
    res.end(JSON.stringify(response))
    return
  }

  // verify password was provided
  if (!req.body.newPassword) {
    response.status = 'error'
    response.error = 'No Password Provided'
    response.description = 'Please provide a new password!'
    res.end(JSON.stringify(response))
    return
  }

  // verify new password is not too short
  if (req.body.newPassword.length < 12) {
    response.status = 'error'
    response.error = 'Password Too Short'
    response.description = 'Password must be at least 12 characters!'
    res.end(JSON.stringify(response))
    return
  }

  // ensure the password does not contain odd characters
  if (
    req.body.newPassword.toString().indexOf(' ') !== -1 ||
    req.body.newPassword.toString().indexOf('\n') !== -1 ||
    req.body.newPassword.toString().indexOf('\t') !== -1
  ) {
    response.status = 'error'
    response.error = 'Password Cannot Contain Odd Characters'
    response.description =
      'The security of your account is important. For this reason, your password may not contain spaces, tabs, return characters or other non-standard characters.'
    res.end(JSON.stringify(response))
    return
  }

  // generate a new hash and salt
  const passwordSalt = sha256(require('crypto').randomBytes(32))
  const passwordHash = sha256(req.body.newPassword + passwordSalt)

  // update the password
  sql = 'update users set password = ?, salt = ? where APIKey = ?'
  await mysql.query(
    sql,
    [passwordHash, passwordSalt, req.body.APIKey]
  )

  // send success message to user
  response.status = 'success'
  res.end(JSON.stringify(response))
}
