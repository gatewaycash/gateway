/**
 * Checks a given password for validity
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Validates passwords against a set or criterion
 */
import { handleError } from 'utils'

export default (password, res) => {
  if (!password) {
    return handleError(
      'No Password',
      'Please provide a password at registration time',
      res
    )
  }

  // verify password is not too short
  if (password.length < 12) {
    return handleError(
      'Password Too Short',
      'Password must be at least 12 characters',
      res
    )
  }

  // ensure the password does not contain odd characters
  if (
    password.toString().indexOf(' ') !== -1 ||
    password.toString().indexOf('\n') !== -1 ||
    password.toString().indexOf('\t') !== -1
  ) {
    return handleError(
      'Password Cannot Contain Odd Characters',
      'The security of your account is important. For this reason, your password may not contain spaces, tabs, return characters or other non-standard characters.',
      res
    )
  }

  return true
}
