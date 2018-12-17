/**
 * POST /paid API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file defines a POST endpoint for /paid
 */
const mysql = require('../../SQLWrapper')
const bchaddr = require('bchaddrjs')

module.exports = async function (req, res) {
  console.log('POST /paid requested')
  console.log(req.body)

  // na object to hold the response
  const response = {}

  // verify a payment address was provided
  if (!req.body.paymentAddress) {
    response.status = 'error'
    response.error = 'No Payment Address'
    response.description = 'Please send back the payment address you received when you called /pay so we know which payment you are marking as paid.'
    res.end(JSON.stringify(response))
    return
  }

  // verify a Payment TXID was provided
  if (!req.body.paymentTXID) {
    response.status = 'error'
    response.error = 'No Payment TXID'
    response.description = 'Please provide the TXID of the transaction which sends funds to the payment address.'
    res.end(JSON.stringify(response))
    return
  }

  // verify the TXID is the correct length
  if (req.body.paymentTXID.length !== 64) {
    response.status = 'error'
    response.error = 'Invalid Payment TXID'
    response.description = 'The TXID you provided is invalid. Check that the payment TXID is correct.'
    res.end(JSON.stringify(response))
    return
  }

  // verify the provided address is valid
  let address = req.body.paymentAddress
  try {
    address = bchaddr.toCashAddress(address)
  } catch (e) {
    address = 'invalid'
  }
  if (address === 'invalid') {
    response.status = 'error'
    response.error = 'Invalid Payment Address'
    response.description = 'Make sure the payment address you provided is valid!'
    res.end(JSON.stringify(response))
    return
  }

  // verify the given address is in the payments table
  let sql = `select paymentAddress
    from payments
    where
    paymentAddress = ?`
  let result = await mysql.query(sql, [address])

  // fail unless the address was found in the database
  if (result.length < 1) {
    response.status = 'error'
    response.error = 'Payment Address Error'
    response.description = 'The payment address you provided is not in the database'
    res.end(JSON.stringify(response))
    return
  }

  // verify the TXID is not already pending
  sql = 'select txid from pending where txid = ?'
  result = await mysql.query(sql, [req.body.paymentTXID])

  // fail unless there are no results
  if (result.length > 0) {
    response.status = 'error'
    response.error = 'Transaction Already Pending'
    response.description = 'This transaction is already pending!'
    res.end(JSON.stringify(response))
    return
  }

  // verify this TXID is not in the payments table
  sql = `select paymentTXID
    from payments
    where
    paymentTXID = ?
    or
    transferTXID = ?`
  result = await mysql.query(sql, [req.body.paymentTXID, req.body.paymentTXID])

  // fail if the tXID already exists
  if (result.length !== 0) {
    response.status = 'error'
    response.error = 'TXID Already Exists'
    response.description = 'This tXID is already associated with a payment. Your payment might already have been processed and sent to a merchant, or you might be sending a TXID from a previous transaction.'
    res.end(JSON.stringify(response))
    return
  }

  // all checks passed, insert this record into pending payments
  sql = 'insert into pending (address, txid) values (?, ?)'
  result = await mysql.query(
    sql,
    [req.body.paymentAddress, req.body.paymentTXID]
  )

  // send back a success message
  response.status = 'success'
  res.end(JSON.stringify(response))
}
