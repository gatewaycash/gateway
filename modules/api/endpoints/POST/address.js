/**
 * POST /address API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a POST endpoint for /address
 */
const mysql = require('../../SQLWrapper')
const bchaddr = require('bchaddrjs')

module.exports = async function (req, res) {
  console.log('POST /address requested')
  console.log(req.body)

  // an object to hold the response
  const response = {}

  // verify the API key was provided
  if (!req.body.APIKey) {
    response.status = 'error'
    response.error = 'No API Key'
    response.description = 'An API Key is required for this endpoint.'
    res.end(JSON.stringify(response))
    return
  }

  // search the database for the record
  let sql = 'select payoutAddress from users where APIKey = ? limit 1'
  let result = await mysql.query(sql, [req.body.APIKey])

  // fail unless there is exactly 1 record
  if (result.length !== 1) {
    response.status = 'error'
    response.error = 'Invalid API Key'
    response.description = 'No user currently has that API key. You might have changed your API key in your account settings, or the API key might be invalid.'
    res.end(JSON.stringify(response))
    return
  }

  // verify username was provided
  if (!req.body.newAddress) {
    response.status = 'error'
    response.error = 'No Address Provided'
    response.description = 'Please provide a new Bitcoin Cash payout address!'
    res.end(JSON.stringify(response))
    return
  }

  // verify new username is not too short
  let newAddress
  try {
    newAddress = bchaddr.toCashAddress(req.body.newAddress)
  } catch(e) {
    response.status = 'error'
    response.error = 'Invalid Address'
    response.description = 'Ensure you provided a valid Bitcoin Cash address!'
    res.end(JSON.stringify(response))
    return
  }

  // update the username
  sql = 'update users set payoutAddress = ? where APIKey = ?'
  await mysql.query(
    sql,
    [newAddress, req.body.APIKey]
  )

  // send success message to user
  response.status = 'success'
  response.newAddress = newAddress
  res.end(JSON.stringify(response))
}
