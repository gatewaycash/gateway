/**
 * POST /register API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a POST endpoint for /register
 */
const mysql = require('../../SQLWrapper')
const bchaddr = require('bchaddrjs')
const sha256 = require('sha256')

module.exports = async function(req, res) {
  console.log('POST /register requested')

  // An object to hold the response
  const response = {}

  // Make sure the user sent an address with their request
  if (!req.body.address) {
    response.status = 'error'
    response.error = 'No Address'
    response.description =
      'No address was provided as a POST parameter. Please ensure that you have included a Bitcoin Cash (BCH) address as a POST parameter to the registration request.'
    res.end(JSON.stringify(response))
    return
  }

  // make sure the address is a valid Bitcoin Cash address
  let address = req.body.address
  try {
    // convert to CashAddress format
    address = bchaddr.toCashAddress(address)
  } catch (e) {
    address = 'invalid'
  }
  if (address === 'invalid') {
    response.status = 'error'
    response.error = 'Invalid Address'
    response.description =
      'It looks like you provided an invalid Bitcoin Cash address. Make sure you\'re using the new-style CashAddress format (e.g. bitcoincash:q.....), and not a legacy-style Bitcoin address (starting with a 1 or a 3). Also ensure that you\'re using a Bitcoin Cash address and not a Bitcoin Core address.'
    res.end(JSON.stringify(response))
    return
  }

  // ensure user has sent a password
  if (!req.body.password) {
    response.status = 'error'
    response.error = 'No Password'
    response.description =
      'Your account registration request needs to include a password.'
    res.end(JSON.stringify(response))
    return
  }

  // ensure the password is sufficiently long
  if (req.body.password.toString().length < 12) {
    response.status = 'error'
    response.error = 'Password Too Short'
    response.description =
      'The security of your account is important. For this reason, your password is required to be at least 12 characters in length.'
    res.end(JSON.stringify(response))
    return
  }

  // ensure the password does not contain odd characters
  if (
    req.body.password.toString().indexOf(' ') !== -1 ||
    req.body.password.toString().indexOf('\n') !== -1 ||
    req.body.password.toString().indexOf('\t') !== -1
  ) {
    response.status = 'error'
    response.error = 'Password Cannot Contain Odd Characters'
    response.description =
      'The security of your account is important. For this reason, your password may not contain spaces, tabs, return characters or other non-standard characters.'
    res.end(JSON.stringify(response))
    return
  }

  // make sure address is not in the database already
  let sql = `select payoutAddress
    from users
    where
    payoutAddress = ?`
  let result = await mysql.query(sql, [req.body.address])

  // fail if user is in the database
  if (result.length !== 0) {
    response.status = 'error'
    response.error = 'Address Already In Use'
    response.description =
      'It looks like that address is already being used by another user! If this is your address, send an email to support@gateway.cash and we\'ll help you get access to this merchant account.'
    res.end(JSON.stringify(response))
    return
  }

  /*
    Create a new merchant account without a username when no username was
    provided
   */
  if (!req.body.username) {
    // create the new user account
    const merchantID = sha256(require('crypto').randomBytes(32)).substr(0, 16)
    const passwordSalt = sha256(require('crypto').randomBytes(32))
    const APIKey = sha256(require('crypto').randomBytes(32))
    const passwordHash = sha256(req.body.password + passwordSalt)
    sql = `insert into users
      (payoutAddress, merchantID, password, salt, APIKey)
      values
      (?, ?, ?, ?, ?)`
    await mysql.query(sql, [
      req.body.address,
      merchantID,
      passwordHash,
      passwordSalt,
      APIKey,
    ])

    // send the API key to the user
    response.status = 'success'
    response.APIKey = APIKey
    res.end(JSON.stringify(response))
    return
  }

  /*
    Registering a new account with a username.
    Proceed with checks since a username was provided
   */

  // verify new username is not too short
  if (req.body.username.length < 5) {
    response.status = 'error'
    response.error = 'Username Too Short'
    response.description = 'Username must be at least 5 characters!'
    res.end(JSON.stringify(response))
    return
  }

  // verify new username is not too long
  if (req.body.username.length > 24) {
    response.status = 'error'
    response.error = 'Username Too Long'
    response.description = 'Username can be at most 24 characters!'
    res.end(JSON.stringify(response))
    return
  }

  // verify username does not contain special characters
  if (
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
    response.description = 'Usernames cannot contain special characters!'
    res.end(JSON.stringify(response))
    return
  }

  // verify username is not in use
  sql = `select username
    from users
    where
    username like ?
    limit 1`
  result = await mysql.query(sql, [req.body.username])

  // fail unless there are no matches
  if (result.length > 0) {
    response.status = 'error'
    response.error = 'Username In Use'
    response.description = 'That username is already in use! Try another?'
    res.end(JSON.stringify(response))
    return
  }

  // create the new record with a username
  const merchantID = sha256(require('crypto').randomBytes(32)).substr(0, 16)
  const passwordSalt = sha256(require('crypto').randomBytes(32))
  const APIKey = sha256(require('crypto').randomBytes(32))
  const passwordHash = sha256(req.body.password + passwordSalt)
  sql = `insert into users (
      payoutAddress,
      merchantID,
      password,
      salt,
      APIKey,
      username
    ) values (?, ?, ?, ?, ?, ?)`
  await mysql.query(sql, [
    req.body.address,
    merchantID,
    passwordHash,
    passwordSalt,
    APIKey,
    req.body.username.toLowerCase(),
  ])

  // send the API key to the user
  response.status = 'success'
  response.APIKey = APIKey
  res.end(JSON.stringify(response))
}
