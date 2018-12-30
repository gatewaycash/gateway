import { get, parseAddress, generateError } from './utils'

export default async (userID, password) => {

  // an object for holding login details
  let loginData = {}

  // check the password for sanity
  if (password.length > 100) {
    return generateError(
      'Password Too Long',
      'Your password is too long. Like, over 100 characters. Shorten it. I\'m not even gonna try man...Not even just for you.'
    )
  }

  // add the password to loginData
  loginData.password = password

  // check the userID for sanity
  // allow 300 characters in case of XPUB attempt
  if (userID.length > 300) {
    return generateError(
      'Username or Address Too Long',
      'Your username or address is too long. Like, over 300 characters. Shorten it. I\'m not even gonna try man...Not even just for you.'
    )
  }

  // try to parse an address
  let parsedID = parseAddress(userID)

  // use an address if one was returned
  if (parsedID !== false) {
    loginData.address = parsedID

  // use a username since no address could be parsed
  } else {
    loginData.username = userID
  }

  let response = await get('/login', loginData)
  return response
}
