import { post, generateError } from './utils'

export default async newUsername => {
  if (!sessionStorage.gatewayAPIKey) {
    return generateError(
      'Not Logged In',
      'Please go back and log in before viewing this page.'
    )
  }
  let response = await post(
    '/username',
    { APIKey: sessionStorage.gatewayAPIKey, newUsername: newUsername }
  )

  return response
}
