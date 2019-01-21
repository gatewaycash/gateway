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
  addAPIKey
} from 'utils'
import bchaddr from 'bchaddrjs'
import bch from 'bitcore-lib-cash'
import sha256 from 'sha256'

export default async (req, res) => {
  console.log('POST /register requested')

  // Make sure the user sent an address with their request
  if (!req.body.address && !req.body.xpub) {
    return handleError(
      'No Address or XPUB',
      'Either a Bitcoin Cash (BCH) address or an XPUB key is required to register',
      res
    )
  }

  // validate the address
  let address = req.body.address
  if (req.body.address) {
    try {
      // convert to CashAddress format
      address = bchaddr.toCashAddress(address)
    } catch (e) {
      return handleError(
        'Invalid Address',
        'It looks like you provided an invalid Bitcoin Cash address. Make sure you\'re using the new-style CashAddress format (e.g. bitcoincash:q.....), and not a legacy-style Bitcoin address (starting with a 1 or a 3). Also ensure that you\'re using a Bitcoin Cash address and not a Bitcoin Core address.',
        res
      )
    }

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
    `insert into users (
        payoutAddress,
        payoutXPUB,
        payoutMethod,
        merchantID,
        passwordHash,
        passwordSalt,
      ) values (?, ?, ?, ?, ?)`,
    [
      address,
      req.body.xpub,
      req.body.xpub ? 'xpub' : 'address',
      merchantID,
      passwordHash,
      passwordSalt,
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
