/**
 * GET /merchantid API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /merchantid
 */
import { mysql, handleResponse, auth } from 'utils'
import url from 'url'

export default async (req, res) => {
  console.log('GET /merchantid requested')

  // parse the provided data
  const query = url.parse(req.url, true).query
  console.log(query)

  let userIndex = await auth(query.APIKey, res)
  if (!userIndex) return

  let result = await mysql.query(
    'SELECT merchantID FROM users WHERE userIndex = ? LIMIT 1',
    [userIndex]
  )
  return handleResponse({
    merchantID: result[0].merchantID
  }, res)
}
