/**
 * POST /paid API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file defines a POST endpoint for /paid
 */
import {
  validateAddress,
  validateTXID,
  mysql,
  handleResponse,
  handleError
} from 'utils'

let POST = async (req, res) => {
  let address = await validateAddress(req.body.paymentAddress, res)
  if (!address) return
  let TXID = await validateTXID(req.body.paymentTXID, res)
  if (!TXID) return

  // verify the TXID is not already known
  let knownTXIDs = await mysql.query(
    'SELECT TXID FROM transactions WHERE TXID = ? LIMIT 1',
    [TXID]
  )
  if (knownTXIDs.length > 0) {
    return handleError(
      'TXID Already Known',
      'Gateway already knows about this transaction. (it is pending or complete)',
      res
    )
  }

  // get the payment being referenced by paymentAddress
  let currentPayment = await mysql.query(
    `SELECT paymentAddress, tableIndex
      FROM payments
      WHERE
      paymentAddress = ?
      AND
      status = ?
      LIMIT 1`,
    [address, 'clicked']
  )

  // fail if the payment wasn't found
  if (currentPayment.length !== 1) {
    return handleError(
      'Cannot Find Payment With This Address',
      'No unpaid invoices with this address exist on this server.',
      res
    )
  }

  // all checks passed, update the status of the payment and save the TXID
  await mysql.query(
    'UPDATE payments SET status = ? WHERE tableIndex = ? LIMIT 1',
    ['pending', currentPayment[0].tableIndex]
  )
  await mysql.query(
    `INSERT INTO transactions
      (paymentIndex, TXID, type)
      VALUES
      (?, ?, ?)`,
    [currentPayment[0].tableIndex, TXID, 'payment']
  )

  return handleResponse({}, res)
}

export default {
  POST: POST
}
