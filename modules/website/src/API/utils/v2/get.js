import { generateError } from '..'

const get = (endpoint, key) => {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(
      `${process.env.REACT_APP_GATEWAY_BACKEND}/v2/${endpoint}?APIKey=${key}`
    )
    if (!response.ok) {
      generateError(
        'Server Error',
        'We weren\'t able to properly communicate with the Gateway servers! Please try again later.'
      )
      reject(response)
    } else {
      resolve(response)
    }
  })
}

export default get
