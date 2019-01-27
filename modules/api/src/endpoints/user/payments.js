/**
 * GET /getpayments API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /getpayments
 */
import { mysql, handleResponse, handleError, auth } from 'utils'

let GET = async (req, res) => {
  let userIndex = await auth(req.body.APIKey, res)
  if (!userIndex) return

  // get the merchantID for the user
  let merchantID = await mysql.query(
    'SELECT merchantID FROM users WHERE tableIndex = ? LIMIT 1',
    [userIndex]
  )
  merchantID = merchantID[0].merchantID

  let resultsPerPage = req.body.resultsPerPage || 25
  let page = req.body.page || 1
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
  let result = await mysql.query(
    `SELECT *
      FROM payments
      WHERE
      merchantID = ?
      AND status LIKE ?
      ORDER BY created
      ASC
      LIMIT ?, ?`,
    [
      merchantID,
      req.body.includeUnpaid === 'YES' ? '%' : 'complete',
      resultsOffset,
      resultsPerPage
    ]
  )

  // get total number of payments
  let total = await mysql.query(
    'SELECT COUNT(1) FROM payments WHERE merchantID = ? AND status LIKE ?',
    [merchantID, req.body.includeUnpaid === 'YES' ? '%' : 'complete']
  )

  let response = []
  for (let i = 0; i < result.length; i++) {
    let object = {
      status: result[i].status,
      paymentAddress: result[i].paymentAddress,
      privateKey: req.body.includeKeys === 'YES' ?
        result[i].privateKey :
        'hidden',
      created: '' + result[i].created,
      transactions: []
    }
    if (result[i].paymentID && result[i].paymentID != 0) {
      object.paymentID = result[i].paymentID
    }
    if (result[i].invoiceAmount && result[i].invoiceAmount != 0) {
      object.invoiceAmount = result[i].invoiceAmount
    }
    if (result[i].platformID && result[i].platformID.length === 16) {
      object.platformID = result[i].platformID
    }
    if (result[i].callbackURL && result[i].callbackURL != 0) {
      object.callbackURL = result[i].callbackURL
    }
    if (result[i].callbackStatus && result[i].callbackStatus != 0) {
      object.callbackStatus = result[i].callbackStatus
    }

    let transactions = await mysql.query(
      'SELECT TXID, type FROM transactions WHERE paymentIndex = ?',
      [result[i].tableIndex]
    )
    object.transactions = transactions
    response.push(object)
  }

  return handleResponse({
    payments: response,
    totalPayments: total[0]['COUNT(1)'],
    totalPages: Math.ceil(total[0]['COUNT(1)'] / resultsPerPage),
    resultsPerPage: resultsPerPage,
    resultsOffset: resultsOffset,
    currentPage: page
  }, res)
}

export default {
  GET: GET
}
