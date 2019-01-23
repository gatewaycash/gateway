/**
 * Handles errors thrown by the API
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Provides a handler for API errors
 */
import prettyjson from 'prettyjson'

export default (error, description, res) => {
  let response = {}
  response.status = 'error'
  response.error = error
  response.description = description
  console.log(prettyjson.render(response, {keysColor: 'red'}))
  if (!res) return false
  res.status(400).end(JSON.stringify(response))
  return false
}
