import { get, generateError } from './utils'

export default async () => {
  if (!sessionStorage.gatewayAPIKey) {
    return generateError(
      'Not Logged In',
      'Please go back and log in before viewing this page.'
    )
  }
  let response = await get(
    '/username',
    { APIKey: sessionStorage.gatewayAPIKey }
  )

  // override default if no username is given
  if (!response.username) {
    response.username = 'No username set'
  }
  return response
}
