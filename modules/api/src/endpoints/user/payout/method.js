/**
 * GET /payoutMethod API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /payoutMethod
 */
import { mysql, handleResponse, auth } from 'utils'
import url from 'url'

let GET = async (req, res) => {
  console.log('GET /payoutMethod requested')

  // parse the provided data
  const query = url.parse(req.url, true).query
  console.log(query)

  let userIndex = await auth(query.APIKey, res)
  if (!userIndex) return

  let result = await mysql.query(
    'SELECT payoutMethod FROM users WHERE userIndex = ? LIMIT 1',
    [userIndex]
  )
  return handleResponse({
    payoutMethod: result[0].payoutMethod
  }, res)
}

export default {
  GET: GET
}
