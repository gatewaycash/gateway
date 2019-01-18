/**
 * GET /totalsales API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /totalsales
 */
const mysql = require('../../SQLWrapper')
const url = require('url')

module.exports = async function (req, res) {
  console.log('GET /totalsales requested')

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

  // search the database for the record
  let sql = 'select totalSales from users where APIKey = ? limit 1'
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
  response.totalSales = result[0].totalSales
  res.end(JSON.stringify(response))
}
