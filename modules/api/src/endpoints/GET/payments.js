/**
 * GET /getpayments API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /getpayments
 */
import { mysql, handleResponse, handleError, auth } from 'utils'
import url from 'url'

export default async (req, res) => {
  console.log('GET /payments requested')

  // parse the provided data
  const query = url.parse(req.url, true).query
  console.log(query)

  let userIndex = await auth(query.APIKey, res)
  if (!userIndex) return

  // get the merchantID for the user
  let result = await mysql.query(
    'SELECT merchantID FROM users WHERE tableIndex = ? LIMIT 1',
    [userIndex]
  )
  let merchantID = result[0].merchantID

  let resultsPerPage = query.resultsPerPage || 25
  let page = query.page || 1
  let resultsOffset = (page - 1) * resultsPerPage

  if (resultsPerPage < 1 || resultsPerPage > 1000 || isNaN(resultsPerPage)) {
    return handleError(
      'Invalid Number of Results Per Page',
      'resultsPerPage must be between 1 and 1000',
      res
    )
  }
  if (page < 1 || isNaN(page)) {
    return handleError(
      'Invalid Page',
      'page must be a number 1 or above',
      res
    )
  }

  // get all payments with this merchantID
  result = await mysql.query(
    `SELECT *
      FROM payments
      WHERE
      merchantID = ?
      ORDER BY created
      ASC
      LIMIT ?, ?`,
    [merchantID, resultsOffset, resultsPerPage]
  )

  let response = []
  result.forEach(async (e) => {
    let object = {
      paymentID: e.paymentID,
      invoiceAmount: e.invoiceAmount,
      status: e.status,
      paymentAddress: e.paymentAddress,
      created: e.created,
      transactions: []
    }
    if (e.paymentID) object.paymentID = e.paymentID
    if (e.invoiceAmount) object.invoiceAmount = e.invoiceAmount
    if (e.platformID) {
      object.platformID = e.platformID
    }

    let transactions = await mysql.query(
      'SELECT * FROM transactions WHERE paymentIndex = ?',
      [e.tableIndex]
    )
    object.transactions = transactions
    response.push(object)
  })
  return handleResponse({payments: response}, res)
}
