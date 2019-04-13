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

  // declare a variable to hold the merchant ID from the query
  merchantID = merchantID[0].merchantID

  // pull out some variables from the request or set defaults
  // TODO: Right now it is possible to give a decimal value for some of these,
  //       which is unacceptable.
  let resultsPerPage = req.body.resultsPerPage || 25
  let page = req.body.page || 1
  let resultsOffset = (page - 1) * resultsPerPage

  //validate that the number of results per page is a positive number under 1000
  if (resultsPerPage < 1 || resultsPerPage > 1000 || isNaN(resultsPerPage)) {
    return handleError(
      'Invalid Number of Results Per Page',
      'resultsPerPage must be between 1 and 1000',
      res
    )
  }

  // validate that the provided page is a positive number
  if (page < 1 || isNaN(page)) {
    return handleError(
      'Invalid Page',
      'page must be a number 1 or above',
      res
    )
  }

  // get all payments with this merchantID for the given range
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

  // get the total number of payments
  let total = await mysql.query(
    'SELECT COUNT(1) FROM payments WHERE merchantID = ? AND status LIKE ?',
    [merchantID, req.body.includeUnpaid === 'YES' ? '%' : 'complete']
  )

  // define a response array to hold the list of payments
  let response = []

  // iterate over each payment in the list
  for (let i = 0; i < result.length; i++) {

    // define an object to hold the processed data
    let object = {
      status: result[i].status,
      paymentAddress: result[i].paymentAddress,
      privateKey: req.body.includeKeys === 'YES' ?
        result[i].privateKey :
        'hidden',
      created: '' + result[i].created,
      transactions: []
    }

    // assign a paymentID to the object if a non-zero paymentID exists
    if (result[i].paymentID && result[i].paymentID != 0) {
      object.paymentID = result[i].paymentID
    }

    // assign an invoiceAmount if a non-zero amount exists
    if (result[i].invoiceAmount && result[i].invoiceAmount != 0) {
      object.invoiceAmount = result[i].invoiceAmount
    }

    // assign a platformID to the response if a valid ID exists
    if (result[i].platformID && result[i].platformID.length === 16) {
      object.platformID = result[i].platformID
    }

    // assign a callbackURL in the response if a valid URL exists
    if (result[i].callbackURL && result[i].callbackURL != 0) {
      object.callbackURL = result[i].callbackURL
    }

    // assign a callbackStatus if a valid status exists
    if (result[i].callbackStatus && result[i].callbackStatus != 0) {
      object.callbackStatus = result[i].callbackStatus
    }

    // find all transactions for the current payment
    let transactions = await mysql.query(
      'SELECT TXID, type FROM transactions WHERE paymentIndex = ?',
      [result[i].tableIndex]
    )

    // add the relevant transactions to the payment
    object.transactions = transactions

    //finally, push the current payment onto the response array
    response.push(object)
  }

  // Return the processed data back to the user
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
