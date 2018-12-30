import axios from 'axios'
import bchaddr from 'bchaddrjs'
import * from './utils'
export default async (userID, password) => {

  // a function for returning errors
  let generateError = (title, description) => {
    return {
      status: 'error',
      error: title,
      description: description
    }
  }

  // create an object to hold the data we send at login-time
  let loginData = {}

  // check if the userID is an address or a username
  try {

  // in case the value failed the address checks, it must be a username
  } catch (e) {

    // check the username for sanity
    if (userID.length > 24)
    loginData.username = userID
  }

  let response = await axios.get(
    REACT_APP_GATEWAY_BACKEND + '/login',
    {
      params: loginData
    }
  )

  // return the response object
  return result.data
}
