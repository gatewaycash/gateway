/**
 * GET /totalsales API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /totalsales
 */
import { mysql, handleResponse, auth } from 'utils'

let GET = async (req, res) => {
  let userIndex = await auth(req.body.APIKey, res)
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
