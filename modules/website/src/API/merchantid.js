import { get } from './utils'
import { navigate } from '@reach/router'

export default async () => {
  if (!sessionStorage.gatewayAPIKey) {
    navigate('/')
  }
  let response = await get('/v2/user/merchantid', {
    APIKey: sessionStorage.gatewayAPIKey
  })
  return response
}
