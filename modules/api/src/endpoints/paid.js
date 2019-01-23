/**
 * POST /paid API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file defines a POST endpoint for /paid
 */
import { mysql, handleResponse, handleError } from 'utils'
import bchaddr from 'bchaddrjs'

export default async (req, res) => {
  console.log('POST /paid requested')
  console.log(req.body)

  // verify a payment address was provided
  if (!req.body.paymentAddress) {
    return handleError(
      'No Payment Address',
      'Please send back the payment address you received when you called /pay so we know which payment you are marking as paid.',
      res
    )
  }

  // verify a Payment TXID was provided
  if (!req.body.paymentTXID) {
    return handleError(
      'No paymentTXID',
      'paymentTXID is required',
      res
    )
  }

  // verify the TXID is the correct length
  if (req.body.paymentTXID.length !== 64) {
    return handleError(
      'Invalid Payment TXID',
      'The TXID must be 64 characters',
      res
    )
  }

  // verify the provided address is valid
  let address = req.body.paymentAddress
  try {
    address = bchaddr.toCashAddress(address)
  } catch (e) {
    return handleError(
      'Invalid paymentAddress',
      'paymentAddress must be a Bitcoin Cash (bCH) address',
      res
    )
  }

  // verify the given address is in the payments table
  let result = await mysql.query(
    `SELECT paymentAddress, tableIndex
      FROM payments
      WHERE
      paymentAddress = ?
      LIMIT 1`,
    [address]
  )

  // fail unless the address was found in the database
  if (result.length < 1) {
    return handleError(
      'paymentAddress not found',
      'paymentAddress was not found in the database',
      res
    )
  }

  // get the paymentIndex of the payment
  let paymentIndex = result.tableIndex

  // verify the TXID is not already known
  result = await mysql.query(
    'SELECT TXID FROM transactions WHERE TXID = ?',
    [req.body.paymentTXID]
  )

  // fail unless there are no results
  if (result.length > 0) {
    return handleError(
      'Transaction Already Pending',
      'This transaction is already pending',
      res
    )
  }

  // all checks passed, insert this record into pending payments
  await mysql.query(
    'INSERT INTO pendingPayments (paymentIndex) VALUES (?)',
    [paymentIndex]
  )

  // add the transaction to the transactions table
  await mysql.query(
    `INSERT INTO transactions
      (paymentIndex, TXID, type)
      VALUES
      (?, ?, "payment")`,
    [paymentIndex, req.body.paymentTXID]
  )

  // send back a success message
  return handleResponse({}, res)
}
