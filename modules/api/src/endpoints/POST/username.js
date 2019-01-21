/**
 * POST /username API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a POST endpoint for /username
 */
import { mysql, handleResponse, auth, validateUsername } from 'utils'

export default async (req, res) => {
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
