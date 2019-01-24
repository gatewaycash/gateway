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
    await axios.post(callbackURL, callbackParameters)
    console.log(
      'Successfully executed callback to URL:',
      callbackURL
    )
  } catch (e) {
    console.error(
      'Unable to execute callback to URL:',
      callbackURL
    )
  }
}
