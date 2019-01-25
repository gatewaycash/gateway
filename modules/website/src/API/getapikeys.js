import { get, generateError } from './utils'

export default async () => {
  if (!sessionStorage.gatewayAPIKey) {
    return generateError(
      'Not Logged In',
      'Please go back and log in before viewing this page.'
    )
  }
  let response = await get(
    '/v2/api/keys',
    { APIKey: sessionStorage.gatewayAPIKey }
  )

  return response
}
