/**
 * GET /getpayments API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /getpayments
 */
const mysql = require('../../SQLWrapper')
const url = require('url')

module.exports = async (req, res) => {
  console.log('GET /payments requested')

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
  let sql = 'select merchantID from users where APIKey = ? limit 1'
  let result = await mysql.query(sql, [query.APIKey])

  // fail unless there is exactly 1 record
  if (result.length !== 1) {
    response.status = 'error'
    response.error = 'Invalid API Key'
    response.description = 'No user currently has that API key. You might have changed your API key in your account settings, or the API key might be invalid.'
    res.end(JSON.stringify(response))
    return
  }

  // search for all complete payments to this merchant ID
  const merchantID = result[0].merchantID

  /*
    TODO:
    We need a way of giving a limit on the number of records to return
    (and setting one by default). We need to return the first 50
    records and indicate to the user which page of records they are on.
    The user needs to be able to specify "pageNumber" and "pageSize"
    (within reason) for the records they are requesting.
    For example, given a pageSize of 50 and a pageNumber of 1, records
    1-50 are returned. For pageNumber 2, records 51-100 are returned.
   */

  sql = 'select paymentAddress, paidAmount, paymentTXID, '
  sql += 'transferTXID, paymentID, created, paymentKey from payments '
  sql += 'where merchantID = ? '
  // require a transferTXID unless includeUnpaid is "YES"
  if (!query.includeUnpaid || query.includeUnpaid !== 'YES') {
    sql += 'and transferTXID is not null '
  }
  sql += 'order by created desc'
  result = await mysql.query(sql, [merchantID])

  // send the payments to the user
  response.status = 'success'
  response.numberOfPayments = result.length
  response.payments = result

  // hide the private keys unless includeKeys is YES
  let hideKeys = (!query.includeKeys || query.includeKeys !== 'YES')
  for (var i = 0; hideKeys && i < response.numberOfPayments; i++) {
    if (hideKeys) {
      response.payments[i].paymentKey = 'hidden'
    }
  }

  // send the response to the user
  res.end(JSON.stringify(response))
}
