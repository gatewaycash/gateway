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
  validateXPUB,
  addAPIKey
} from 'utils'
import sha256 from 'sha256'

let POST = async (req, res) => {
  console.log('POST /register requested')

  // Make sure the user sent an address or XPUB key with their request
  if (!req.body.address && !req.body.XPUB) {
    return handleError(
      'No Address or XPUB',
      'Either a Bitcoin Cash (BCH) address or an XPUB key is required to register',
      res
    )
  }

  // validate the address or XPUB key
  let addressValid = null
  let XPUBValid = null
  if (req.body.XPUB) {
    XPUBValid = validateXPUB(req.body.XPUB, res)
    if (!XPUBValid) return
  } else {
    addressValid = validateAddress(req.body.address, res)
    if (!addressValid) return
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
      `SELECT
        allowXPUB,
        tableIndex
        FROM platforms
        WHERE
        platformID = ?
        LIMIT 1`,
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

    // fail if the platform does not allow XPUB and an XPUB key is being used
    if (platform[0].allowXPUB == 0 && XPUBValid !== null) {
      return handleError(
        'XPUB Not Allowed',
        'This platform does not allow the use of merchant extended public keys',
        res
      )
    }

    // fail if XPUB was provided by we aren't bypassing the warning
    if (
      XPUBValid !== null &&
      req.body.dismissXPUBWithPlatformIDWarning !== 'YES'
    ) {
      return handleError(
        'XPUB for Platforms Users is Dangerous',
        'You should not generally use an XPUB key with a Platforms account. Read the docs at https://api.gateway.cash/ for how to bypass this warning',
        res
      )
    }
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      addressValid,
      XPUBValid,
      XPUBValid ? 'XPUB' : 'address',
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

export default {
  POST: POST
}
