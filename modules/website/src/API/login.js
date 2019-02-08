import { get, parseAddress, generateError } from './utils'

export default async (userID, password) => {

  // an object for holding login details
  let loginData = {}

  // check the password for sanity
  if (password.length > 100) {
    return generateError(
      'Password Too Long',
      'Your password must not be longer than 100 characters.'
    )
  }

  // add the password to loginData
  loginData.password = password

  // check the userID for sanity
  // allow 300 characters in case of XPUB attempt
  if (userID.length > 100) {
    return generateError(
      'Username Too Long',
      'Your username must not be longer than 100 characters.'
    )
  }

  // try to parse an address
  let parsedID = parseAddress(userID)

  // use an address if one was returned
  if (parsedID !== false) {
    loginData.username = parsedID.substr(12, 20)

  // use a username since no address could be parsed
  } else {
    loginData.username = userID
  }

  let response = await get('/v2/user/login', loginData)
  return response
}
