/**
 * GET /address API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /address
 */
import { mysql, auth, handleResponse } from 'utils'
const url = require('url')

export default async (req, res) => {
  console.log('GET /address requested')

  // parse the provided data
  const query = url.parse(req.url, true).query
  console.log(query)

  let userID = await auth(query.APIKey, res)
  if (!userID) return

  // return the record
  let result = await mysql.query(
    'SELECT payoutAddress FROM users WHERE index = ? LIMIT 1',
    [userID]
  )
  handleResponse({
    address: result.payoutAddress
  }, res)
}
