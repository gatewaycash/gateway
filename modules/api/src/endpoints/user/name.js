/**
 * GET /username API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /username
 */
import { mysql, handleResponse, auth, validateUsername } from 'utils'
import url from 'url'

let GET = async (req, res) => {
  console.log('GET /username requested')

  // parse the provided data
  const query = url.parse(req.url, true).query
  console.log(query)

  let userIndex = await auth(query.APIKey, res)
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
  console.log('POST /username requested')

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
    [req.body.newUsername, userIndex]
  )

  // send success message to user
  return handleResponse({}, res)
}

export default {
  GET: GET,
  PUT: PUT
}
