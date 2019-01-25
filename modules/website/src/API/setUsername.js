import { patch, generateError } from './utils'

export default async newUsername => {
  if (!sessionStorage.gatewayAPIKey) {
    return generateError(
      'Not Logged In',
      'Please go back and log in before viewing this page.'
    )
  }
  let response = await patch(
    '/v2/user/name',
    { APIKey: sessionStorage.gatewayAPIKey, newUsername: newUsername }
  )

  return response
}
