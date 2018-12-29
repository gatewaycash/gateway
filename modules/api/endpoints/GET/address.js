/**
 * GET /address API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /address
 */
const mysql = require('../../SQLWrapper.js')
const url = require('url')

module.exports = async function (req, res) {
  console.log('GET /address requested')

  // parse the provided data
  const query = url.parse(req.url, true).query
  console.log(query)

  // an object to hold the response
  const response = {}

  // verify the API key was provided
  if (!query.APIKey) {
    response.status = 'error'
    response.error = 'No API Key'
    response.description = 'An API Key is required for this endpoint.'
    res.end(JSON.stringify(response))
    return
  }

  // search for the record
  let sql = 'select payoutAddress from users where APIKey = ? limit 1'
  let result = await mysql.query(sql, [query.APIKey])

  // fail unless there is exactly 1 record
  if (result.length !== 1) {
    response.status = 'error'
    response.error = 'Invalid API Key'
    response.description = 'No user currently has that API key. You might have changed your API key in your account settings, or the API key might be invalid.'
    res.end(JSON.stringify(response))
    return
  }

  // send the response to the user
  response.status = 'success'
  response.payoutAddress = result[0].payoutAddress
  res.end(JSON.stringify(response))
}
