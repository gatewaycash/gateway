/**
 * Endpoint for /platforms
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines an endpoint for /platforms
 */
import { auth, handleResponse, handleError, mysql } from 'utils'
import sha256 from 'sha256'

// GET all platforms owned by a given user
let GET = async (req, res) => {
  let userIndex = await auth(req.body.APIKey, res)
  if (!userIndex) return
  let platforms = await mysql.query(
    `SELECT *
      FROM platforms
      WHERE
      ownerUserIndex = ?`,
    [userIndex]
  )
  let result = []
  for (let i = 0; i < platforms.length; i++) {
    result.push({
      created: '' + platforms[i].created,
      name: platforms[i].name,
      description: platforms[i].description,
      platformID: platforms[i].platformID
    })
  }
  return handleResponse({
    platforms: result,
    numberOfPlatforms: platforms.length
  }, res)
}

// PUT a new platform in the database
let PUT = async (req, res) => {
  // ensure a platform name was given
  if (!req.body.name) {
    return handleError(
      'Platform Name is Required',
      'Please provide a name for your new platform',
      res
    )
  }

  let name = req.body.name
  let description = req.body.description || 'New platform'

  // ensure the lengths are OK
  if (name.length > 36) {
    return handleError(
      'Platform Name Too Long',
      'Platform names are limited to 36 characters',
      res
    )
  }
  if (description.length > 160) {
    return handleError(
      'Platform Description Too Long',
      'Platform descriptions are limited to 160 characters',
      res
    )
  }

  // authenticate the user
  let userIndex = await auth(req.body.APIKey, res)
  if (!userIndex) return

  // generate a new platform ID
  let platformID = sha256(require('crypto').randomBytes(32)).substr(0, 16)

  // add the record
  await mysql.query(
    `INSERT INTO platforms
      (name, description, platformID, ownerUserIndex)
      VALUES (?, ?, ?, ?)`,
    [name, description, platformID, userIndex]
  )

  // send the new platform ID and info
  return handleResponse({
    platformID: platformID
  }, res)
}

// PATCH an existing platform with new data
let PATCH = async (req, res) => {
  // ensure newName or newDescription was given
  if (!req.body.newName && !req.body.newDescription) {
    return handleError(
      'No New Data',
      'Provide a new name or description for the platform',
      res
    )
  }

  // validate length of name if given
  if (req.body.newName && req.body.newName.length > 36) {
    return handleError(
      'Platform Name Too Long',
      'Max length is 36 characters',
      res
    )
  }

  // validate length of description if given
  if (req.body.newDescription && req.body.newDescription.length > 160) {
    return handleError(
      'Platform Description Too Long',
      'Max length is 160 characters',
      res
    )
  }

  // authenticate the user
  let userIndex = await auth(req.body.APIKey, res)
  if (!userIndex) return

  // find the platform
  let platform = await mysql.query(
    `SELECT *
      FROM platforms
      WHERE
      platformID = ?
      AND
      ownerUserIndex = ?
      LIMIT 1`,
    [req.body.platformID, userIndex]
  )

  // error if not found
  if (platform.length !== 1) {
    return handleError(
      'Platform Not Found',
      'Either the platform ID is invalid or you are not the owner',
      res
    )
  }

  platform = platform[0]

  // assign the new values
  let newName = req.body.newName || platform.name
  let newDescription = req.body.newDescription || platform.description

  // update the record
  await mysql.query(
    'UPDATE platforms SET name = ?, description = ? WHERE tableIndex = ?',
    [newName, newDescription, platform.tableIndex]
  )

  // send the success message
  return handleResponse({
    newName: newName,
    newDescription: newDescription,
    platformID: req.body.platformID
  }, res)
}

// DELETE a plattform, including all users and commissions (maybe eventually)
let DELETE = async (req, res) => {
  return handleError(
    'Platforms Cannot Be Deleted',
    'Deleting a platform, its users and commissions is too dangerous. Just stop using it. Send email to support@gateway.cash if you need a platform deleted manually.',
    res
  )
}

export default {
  GET: GET,
  PUT: PUT,
  PATCH: PATCH,
  DELETE: DELETE
}
