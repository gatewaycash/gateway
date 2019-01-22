/**
 * GET /username API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /username
 */
import { mysql, handleResponse, auth } from 'utils'
import url from 'url'

export default async (req, res) => {
  console.log('GET /username requested')

  // parse the provided data
  const query = url.parse(req.url, true).query
  console.log(query)

  let userIndex = await auth(query.APIKey, res)
  if (!userIndex) return

  let result = await mysql.query(
    'SELECT username FROM users WHERE tableIndex = ? LIMIT 1',
    [userIndex]
  )
  return handleResponse({
    username: result[0].username
  }, res)
}
