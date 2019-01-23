/**
 * Adds an API Key to a user's account
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a function for adding API keys
 */
import sha256 from 'sha256'
import { mysql, handleError } from 'utils'

export default async (userIndex, label, res) => {
  if (label.length > 36) {
    return handleError(
      'API Key Label Too Long',
      'API key labels are limited to 36 characters',
      res
    )
  }
  let newKey = sha256(require('crypto').randomBytes(32))
  await mysql.query(
    `INSERT INTO APIKeys
      (userIndex, APIKey, label)
      VALUES
      (?, ?, ?)`,
    [userIndex, newKey, label]
  )
  return newKey
}
