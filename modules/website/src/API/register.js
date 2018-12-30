import { post, parseAddress, generateError } from './utils'

export default async (address, username, password, passwordConfirm) => {

  // an object for holding registration details
  let payload = {}

  // check the password for sanity
  if (password.length > 100) {
    return generateError(
      'Password Too Long',
      'Your password is too long. Like, over 100 characters. Shorten it. I\'m not even gonna try man...Not even just for you.'
    )
  }

  // verify password is the same as confirm
  if (password !== passwordConfirm) {
    return generateError(
      'Passwords Do Not Match',
      'The passwords you entered do not match. Check the two passwords and try again.'
    )
  }

  // password must be at least 12 characters
  if (password.length < 12) {
    return generateError(
      'Password Too Short',
      'The security of your Gateway merchant account is important. For that reason, please ensure that your password is at least 12 characters long.'
    )
  }

  // add the password to the payload
  payload.password = password

  // check the username for sanity
  if (username.length > 24) {
    return generateError(
      'Username Too Long',
      'Usernames cannot be longer than 24 characters.'
    )
  }
  payload.username = username

  // try to parse an address
  let parsedAddress = parseAddress(address)
  if (!parsedAddress) {
    return generateError(
      'Invalid Address',
      'Make sure you are using a valid Bitcoin Cash address. Generally, these will start with "bitcoincash:". For help generating an address, see below.'
    )
  }
  payload.address = parsedAddress

  let response = await post('/register', payload)
  return response
}
