/**
 * Handles errors thrown by the API
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Provides a handler for API errors
 */
import prettyjson from 'prettyjson'

export default (error, description, res, status = 400) => {
  let response = {}
  response.status = 'error'
  response.error = error
  response.description = description
  console.log(prettyjson.render(response, { keysColor: 'red' }))
  if (!res) return false
  res.statusCode = status
  res.end(JSON.stringify(response))
  return false
}
