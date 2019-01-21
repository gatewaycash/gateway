/**
 * POST /password API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a POST endpoint for /password
 */
import { mysql, handleResponse, auth, validatePassword } from 'utils'
import sha256 from 'sha256'

export default async (req, res) => {
  console.log('POST /password requested')

  let passwordValid = await validatePassword(req.body.newPassword, res)
  if (!passwordValid) return

  // verify the user is authorized
  let userIndex = await auth(req.body.APIKey, res)
  if (!userIndex) return

  // generate a new hash and salt
  const passwordSalt = sha256(require('crypto').randomBytes(32))
  const passwordHash = sha256(req.body.newPassword + passwordSalt)

  // update the password
  await mysql.query(
    `UPDATE users
      SET passwordHash = ?,
      passwordSalt = ?
      WHERE tableIndex = ?
      LIMIT 1`,
    [passwordHash, passwordSalt, userIndex]
  )

  // send success message to user
  return handleResponse({}, res)
}
