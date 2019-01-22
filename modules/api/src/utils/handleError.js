/**
 * Handles errors thrown by the API
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Provides a handler for API errors
 */
export default (error, description, res) => {
  if (!res) return false
  let response = {}
  response.status = 'error'
  response.error = error
  response.description = description
  res.status(400).end(JSON.stringify(response))
  return false
}
