/**
 * Checks a given username for validity
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Validates usernames against a set or criterion
 */
import { mysql, handleError } from 'utils'

export default async (username, res) => {

  if (!username) {
    return handleError(
      'No Username',
      'A username is required.',
      res
    )
  }

  // verify new username is not too short
  if (username.length < 5) {
    return handleError(
      'Username Too Short',
      'Usernames must be at least 5 characters',
      res
    )
  }

  // verify new username is not too long
  if (username.length > 24) {
    return handleError(
      'Username Too Long',
      'Usernames must be at most 24 characters',
      res
    )
  }

  // verify username does not contain special characters
  if (
    username.indexOf(' ') !== -1 ||
    username.indexOf('\n') !== -1 ||
    username.indexOf('\t') !== -1 ||
    username.indexOf('!') !== -1 ||
    username.indexOf('@') !== -1 ||
    username.indexOf('#') !== -1 ||
    username.indexOf('$') !== -1 ||
    username.indexOf('%') !== -1 ||
    username.indexOf('^') !== -1 ||
    username.indexOf('&') !== -1 ||
    username.indexOf('*') !== -1 ||
    username.indexOf('()') !== -1 ||
    username.indexOf(')') !== -1 ||
    username.indexOf('|') !== -1 ||
    username.indexOf('\\') !== -1 ||
    username.indexOf('/') !== -1 ||
    username.indexOf('?') !== -1 ||
    username.indexOf('<') !== -1 ||
    username.indexOf('>') !== -1 ||
    username.indexOf('{') !== -1 ||
    username.indexOf('}') !== -1 ||
    username.indexOf('[') !== -1 ||
    username.indexOf(']') !== -1 ||
    username.indexOf(';') !== -1
  ) {
    return handleError(
      'No Special Characters',
      'Usernames cannot contain special characters like <,]?;*',
      res
    )
  }

  // verify username is not in use
  let result = await mysql.query(
    `SELECT username
      FROM users
      WHERE
      username LIKE ?`,
    [username]
  )

  // fail unless there are no matches
  if (result.length !== 0) {
    return handleError(
      'Username In Use',
      'Someone already took that username!',
      res
    )
  }

  return username.toString().toLowerCase()
}
