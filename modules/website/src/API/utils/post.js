import axios from 'axios'
import { generateError } from '.'

export default async (endpoint, params) => {
  try {
    let response = await axios.post(
      process.env.REACT_APP_GATEWAY_BACKEND + endpoint,
      params
    )
    return response.data
  } catch (e) {
    return generateError(
      'Server Error',
      'We weren\'t able to properly communicate with the Gateway servers! Please try again later.'
    )
  }
}
