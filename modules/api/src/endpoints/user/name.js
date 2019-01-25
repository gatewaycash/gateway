/**
 * GET /username API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /username
 */
import { mysql, handleResponse, auth, validateUsername } from 'utils'

let GET = async (req, res) => {
  let userIndex = await auth(req.body.APIKey, res)
  if (!userIndex) return

  let result = await mysql.query(
    'SELECT username FROM users WHERE tableIndex = ? LIMIT 1',
    [userIndex]
  )
  return handleResponse({
    username: result[0].username
  }, res)
}

let PUT = async (req, res) => {
  let usernameValid = await validateUsername(req.body.newUsername, res)
  if (!usernameValid) return

  // verify the user is authorized
  let userIndex = await auth(req.body.APIKey, res)
  if (!userIndex) return

  // update the username
  await mysql.query(
    `UPDATE users
      SET username = ?
      WHERE tableIndex = ?
      LIMIT 1`,
    [usernameValid, userIndex]
  )

  // send success message to user
  return handleResponse({
    newUsername: usernameValid
  }, res)
}

export default {
  GET: GET,
  PUT: PUT,
  PATCH: PUT
}
