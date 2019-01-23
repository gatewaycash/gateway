/**
 * /address API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines endpoint for /address
 */
import { mysql, auth, handleResponse, validateAddress } from 'utils'
import url from 'url'

let GET = async (req, res) => {
  console.log('GET /address requested')

  // parse the provided data
  const query = url.parse(req.url, true).query
  console.log(query)

  let userIndex = await auth(query.APIKey, res)
  if (!userIndex) return

  // return the record
  let result = await mysql.query(
    'SELECT payoutAddress FROM users WHERE tableIndex = ? LIMIT 1',
    [userIndex]
  )
  handleResponse({
    address: result[0].payoutAddress
  }, res)
}

let PUT = async (req, res) => {
  console.log('POST /address requested')
  console.log(req.body)

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
  PUT: PUT
}
