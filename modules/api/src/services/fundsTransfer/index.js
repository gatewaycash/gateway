/**
 * Funds transfer daemon
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Provides a daemon for transfering funds
 */
import { mysql, getAddressBalance } from 'utils'
import processXPUB from './processXPUB'
import processPayment from './processPayment'

/**
 * Checks if apayment needs to be processed.
 * Calls processPayment or processXPUB if needed.
 * @param payment - The record from the payments table
 */
let checkPayment = async (payment) => {
  console.log(`Checking payment #${payment.tableIndex}...`)
  let balance = await getAddressBalance(payment.paymentAddress)
  if (balance <= 0) return
  if (payment.privateKey && payment.privateKey.toString().length > 1) {
    try {
      await processPayment(payment)
      console.log(`Successfully forwarded payment #${payment.tableIndex}`)
    } catch (e) {
      console.error(`Error with payment #${payment.tableIndex}`)
      console.error(e)
    }
  } else {
    try {
      await processXPUB(payment)
      console.log(`XPUB payment #${payment.tableIndex} finished!`)
    } catch (e) {
      console.error(`Error with XPUB payment #${payment.tableIndex}`)
      console.error(e)
    }
  }
}

export default async () => {
  let pendingPayments = await mysql.query(
    'SELECT * FROM payments WHERE status = ?',
    ['pending']
  )
  for (let i = 0; i < pendingPayments.length; i++) {
    await checkPayment(pendingPayments[i])
  }
}
