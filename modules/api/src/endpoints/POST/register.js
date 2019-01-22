/**
 * POST /register API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a POST endpoint for /register
 */
import {
  mysql,
  handleError,
  handleResponse,
  validateUsername,
  validatePassword,
  validateAddress,
  addAPIKey
} from 'utils'
import bchaddr from 'bchaddrjs'
import bch from 'bitcore-lib-cash'
import sha256 from 'sha256'

export default async (req, res) => {
  console.log('POST /register requested')

  // Make sure the user sent an address or XPUB key with their request
  if (!req.body.address && !req.body.xpub) {
    return handleError(
      'No Address or XPUB',
      'Either a Bitcoin Cash (BCH) address or an XPUB key is required to register',
      res
    )
  }

  // validate the address
  let address
  if (req.body.address) {
    address = validateAddress(req.body.address, res)
    if (!address) return

  // validate the XPUB key
  } else {
    try {
      bch.HDNode.fromBase58(req.body.xpub)
    } catch (e) {
      return handleError(
        'Invalid XPUB key',
        'The XPUB key you provided is invalid',
        res
      )
    }
  }

  let passwordValid = await validatePassword(req.body.password, res)
  if (!passwordValid) return

  // make sure address and xpub are not in the database already
  let result = await mysql.query(
    `SELECT payoutAddress
      FROM users
      WHERE
      payoutAddress = ?
      or
      payoutXPUB = ?
      LIMIT 1`,
    [req.body.address, req.body.xpub]
  )

  // fail if user is in the database
  if (result.length !== 0) {
    return handleError(
      'Address or XPUB key is in use',
      'It looks like that address is already being used by another user! If this is your address, send an email to support@gateway.cash and we\'ll help you get access to this merchant account.',
      res
    )
  }

  // validate the username
  let usernameValid = await validateUsername(req.body.username, res)
  if (!usernameValid) return

  // create the new user account
  const merchantID = sha256(require('crypto').randomBytes(32)).substr(0, 16)
  const passwordSalt = sha256(require('crypto').randomBytes(32))
  const passwordHash = sha256(req.body.password + passwordSalt)
  await mysql.query(
    `INSERT INTO users (
        payoutAddress,
        payoutXPUB,
        payoutMethod,
        merchantID,
        passwordHash,
        passwordSalt,
        username
      ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      address,
      req.body.xpub,
      req.body.xpub ? 'xpub' : 'address',
      merchantID,
      passwordHash,
      passwordSalt,
      req.body.username
    ]
  )

  let userIndex = await mysql.query(
    'SELECT tableIndex FROM users WHERE merchantID = ?',
    [merchantID]
  )
  userIndex = userIndex[0].tableIndex

  let APIKey = await addAPIKey(userIndex, 'Created at registration')

  // send the API key to the user
  return handleResponse({
    APIKey: APIKey
  }, res)
}
