/**
 * GET /totalsales API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /totalsales
 */
import { mysql, handleResponse, auth } from 'utils'
import url from 'url'

let GET = async (req, res) => {
  console.log('GET /totalsales requested')

  // parse the provided data
  const query = url.parse(req.url, true).query
  console.log(query)

  let userIndex = await auth(query.APIKey, res)
  if (!userIndex) return

  let result = await mysql.query(
    'SELECT totalSales FROM users WHERE tableIndex = ? LIMIT 1',
    [userIndex]
  )
  return handleResponse({
    totalSales: result[0].totalSales
  }, res)
}

export default {
  GET: GET
}
