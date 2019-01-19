/**
 * Adds an API Key to a user's account
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a function for adding API keys
 */
import sha256 from 'sha256'
import { mysql } from 'utils'

export default async (userIndex, label) => {
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
