/**
 * POST /address API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a POST endpoint for /address
 */
import { auth, mysql, handleResponse, handleError } from 'utils'
import bchaddr from 'bchaddrjs'

export default async (req, res) => {
  console.log('POST /address requested')
  console.log(req.body)

  // verify address was provided
  if (!req.body.newAddress) {
    return handleError(
      'No Address Provided',
      'Please provide a new Bitcoin Cash address',
      res
    )
  }

  // verify new address is valid
  let newAddress
  try {
    newAddress = bchaddr.toCashAddress(req.body.newAddress)
  } catch(e) {
    return handleError(
      'Invalid Address',
      'Provide a valid Bitcoin Cash (BCH) address',
      res
    )
  }

  let userIndex = await auth(req.body.APIKey)
  if (!userIndex) return

  // update the address
  await mysql.query(
    'UPDATE users SET payoutAddress = ? WHERE tableIndex = ? LIMIT 1',
    [newAddress, userIndex]
  )

  return handleResponse({
    newAdress: newAddress
  }, res)
}
