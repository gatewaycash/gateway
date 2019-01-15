import { post, generateError } from './utils'

export default async (newPassword, confirm) => {
  if (!sessionStorage.gatewayAPIKey) {
    return generateError(
      'Not Logged In',
      'Please go back and log in before viewing this page.'
    )
  }

  if (newPassword !== confirm) {
    return generateError(
      'Passwords Do Not Match',
      'Check that the two passwords match and try again.'
    )
  }

  let response = await post(
    '/password',
    { APIKey: sessionStorage.gatewayAPIKey, newPassword: newPassword }
  )

  return response
}
