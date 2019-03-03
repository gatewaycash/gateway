import { generateError } from './utils'
import { get } from './utils/v2'

export default () => {
  if (!sessionStorage.gatewayAPIKey) {
    generateError(
      'Not Logged In',
      'Please go back and log in before viewing this page.'
    )
  } else {
    return get('user/sales', sessionStorage.gatewayAPIKey).then(response =>
      response.json()
    )
  }
}
