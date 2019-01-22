/**
 * POST /address API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a POST endpoint for /address
 */
import { auth, mysql, handleResponse, validateAddress } from 'utils'

export default async (req, res) => {
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
