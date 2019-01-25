/**
 * Executes callbacks when payments were successfully completed
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a function for executing callback URLs
 */
import axios from 'axios'
import { mysql } from 'utils'

/**
 * Executes a callback given a payment
 * @param {object} payment - The payment on which to execute the callback
 */
export default async (payment) => {
  let callbackURL = payment.callbackURL
  if (
    !callbackURL ||
    callbackURL === '' ||
    callbackURL === 'None' ||
    callbackURL == 0
  ) {
    console.log(`No callback URL provided for payment #${payment.tableIndex}`)
    await mysql.query(
      'UPDATE payments SET callbackStatus = ? WHERE tableIndex = ? LIMIT 1',
      ['invalid-url', payment.tableIndex]
    )
    return false
  }

  // verify the callback URL is sane
  if (
    !callbackURL.startsWith('https://') &&
    !callbackURL.startsWith('http://')
  ) {
    console.log(
      'Callback URL is invalid:',
      callbackURL
    )
    await mysql.query(
      'UPDATE payments SET callbackStatus = ? WHERE tableIndex = ? LIMIT 1',
      ['invalid-url', payment.tableIndex]
    )
    return false
  }

  // discover associated payment transactions
  let transactions = await mysql.query(
    'SELECT TXID, type FROM transactions WHERE paymentIndex = ?',
    [payment.tableIndex]
  )

  // build the callback parameters
  let callbackParameters = {
    paymentAddress: payment.paymentAddress,
    transactions: transactions
  }

  // try to execute the callback
  try {
    let response = await axios.post(callbackURL, callbackParameters)
    console.log(
      `Payment #${payment.tableIndex} callback completed with status ${response.status}`
    )
    await mysql.query(
      'UPDATE payments SET callbackStatus = ? WHERE tableIndex = ? LIMIT 1',
      [`status-${response.status}`, payment.tableIndex]
    )
  } catch (e) {
    console.error(
      `Payment #${payment.tableIndex} callback failed: ${e.code}`
    )
    await mysql.query(
      'UPDATE payments SET callbackStatus = ? WHERE tableIndex = ? LIMIT 1',
      [`failed-${e.code.toString().substr(0, 20)}`, payment.tableIndex]
    )
  }
}
