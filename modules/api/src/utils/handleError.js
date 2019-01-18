/**
 * Handles errors thrown by the API
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Provides a handler for API errors
 */
module.exports = (error, description, res) => {
  let response = {}
  response.status = 'error'
  response.error = error
  response.description = description
  res.end(JSON.stringify(response))
  return false
}
