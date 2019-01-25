/**
 * GET /merchantid API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /merchantid
 */
import { mysql, handleResponse, auth } from 'utils'

let GET = async (req, res) => {
  let userIndex = await auth(req.body.APIKey, res)
  if (!userIndex) return

  let result = await mysql.query(
    'SELECT merchantID FROM users WHERE tableIndex = ? LIMIT 1',
    [userIndex]
  )
  return handleResponse({
    merchantID: result[0].merchantID
  }, res)
}

export default {
  GET: GET
}
