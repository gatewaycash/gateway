/**
 * GET /xpub API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /xpub
 */
import { mysql, handleResponse, auth } from 'utils'
import url from 'url'

export default async (req, res) => {
  console.log('GET /xpub requested')

  // parse the provided data
  const query = url.parse(req.url, true).query
  console.log(query)

  let userIndex = await auth(query.APIKey, res)
  if (!userIndex) return

  let result = await mysql.query(
    'SELECT payoutXPUB FROM users WHERE tableIndex = ? LIMIT 1',
    [userIndex]
  )
  return handleResponse({
    payoutXPUB: result[0].payoutXPUB
  }, res)
}
