/**
 * /address API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines endpoint for /address
 */
import { mysql, auth, handleResponse, validateAddress } from 'utils'

// GET endpoint for returning the payoutAddress
let GET = async (req, res) => {
  console.log('auth')
  let userIndex = await auth(req.body.APIKey, res)
  if (!userIndex) return
  let result = await mysql.query(
    'SELECT payoutAddress FROM users WHERE tableIndex = ? LIMIT 1',
    [userIndex]
  )
  handleResponse({
    address: result[0].payoutAddress
  }, res)
}

// PUT / PATCH request for adding or updating paymentAddress
let PATCH = async (req, res) => {
  let addressValid = validateAddress(req.body.newAddress, res)
  if (!addressValid) return
  let userIndex = await auth(req.body.APIKey)
  if (!userIndex) return
  await mysql.query(
    'UPDATE users SET payoutAddress = ? WHERE tableIndex = ? LIMIT 1',
    [addressValid, userIndex]
  )
  return handleResponse({
    newAdress: addressValid
  }, res)
}

export default {
  GET: GET,
  PATCH: PATCH,
  PUT: PATCH
}
