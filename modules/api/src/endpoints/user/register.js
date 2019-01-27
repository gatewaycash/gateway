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
import bch from 'bitcore-lib-cash'
import sha256 from 'sha256'

export default async (req, res) => {
  console.log('POST /register requested')

  // Make sure the user sent an address or XPUB key with their request
  if (!req.body.address && !req.body.XPUB) {
    return handleError(
      'No Address or XPUB',
      'Either a Bitcoin Cash (BCH) address or an XPUB key is required to register',
      res
    )
  }

  // validate the address
  let address = null
  if (req.body.address) {
    address = validateAddress(req.body.address, res)
    if (!address) return

  // validate the XPUB key
  } else {
    try {
      new bch.HDPublicKey(req.body.XPUB)
    } catch (e) {
      return handleError(
        'Invalid XPUB key',
        'The XPUB key you provided is invalid',
        res
      )
    }
  }

  // validate the username and password
  let passwordValid = await validatePassword(req.body.password, res)
  if (!passwordValid) return
  let usernameValid = await validateUsername(req.body.username, res)
  if (!usernameValid) return

  // validate the platform ID if given
  let platformIndex = 0
  if (req.body.platformID) {
    // discover the platformIndex from platformID
    let platform = await mysql.query(
      'SELECT platformIndex FROM platforms WHERE platformID = ? LIMIT 1',
      [req.body.platformID]
    )

    // fail if there was no platform found
    if (platform.length !== 1) {
      return handleError(
        'Invalid Platform ID',
        'No platform with that ID could be found. Please contact the platform administrator (the person who runs this website) and tell them their Gateway registrations are failing.',
        res
      )
    }
    platformIndex = platform[0].tableIndex
  }

  // create the new user account
  const merchantID = sha256(require('crypto').randomBytes(32)).substr(0, 16)
  const passwordSalt = sha256(require('crypto').randomBytes(32))
  const passwordHash = sha256(passwordValid + passwordSalt)
  await mysql.query(
    `INSERT INTO users (
        payoutAddress,
        payoutXPUB,
        payoutMethod,
        merchantID,
        passwordHash,
        passwordSalt,
        username,
        platformIndex
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      address,
      req.body.XPUB,
      req.body.XPUB ? 'XPUB' : 'address',
      merchantID,
      passwordHash,
      passwordSalt,
      usernameValid,
      platformIndex
    ]
  )

  let userIndex = await mysql.query(
    'SELECT tableIndex FROM users WHERE merchantID = ?',
    [merchantID]
  )
  userIndex = userIndex[0].tableIndex

  let APIKey = await addAPIKey(userIndex, 'Created at registration', res)

  // send the API key to the user
  return handleResponse({
    APIKey: APIKey
  }, res)
}
