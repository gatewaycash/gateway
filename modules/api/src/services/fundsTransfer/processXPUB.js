/**
 * Process XPUB payments
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a function for processing XPUB payments
 * @param {object} payment - The payment row in the payments table
 */
import { mysql, executeCallback } from 'utils'
import axios from 'axios'
import bchaddr from 'bchaddrjs'
import dotenv from 'dotenv'
dotenv.config()

export default async (payment) => {
  // Increment the totalSales of the merchant
  // This requires us to discover the amount from the TXID
  let TXIDs = await mysql.query(
    'SELECT TXID FROM transactions WHERE paymentIndex = ?',
    [payment.tableIndex]
  )

  /*
    This finds the actual value paid to the merchant's address and ignores any
    change outputs on the TXID that was submitted.
  */
  let paymentTotal = 0
  for (let i = 0; i < TXIDs.length; i++) {
    try {
      let result = await axios.get(
        `${process.env.BLOCK_EXPLORER_BASE}/tx/${TXIDs[i].TXID}`
      )
      for(let l = 0; l < result.data.vout.length; l++) {{
        let f = result.data.vout[l]
        if (f.scriptPubKey && f.scriptPubKey.addresses) {
          try {
            if (
              bchaddr.toCashAddress(f.scriptPubKey.addresses[0]) ===
              bchaddr.toCashAddress(payment.paymentAddress)
            ) {
              paymentTotal += f.value
            }
          } catch (e) {
            console.error(
              `Error converting addresses for XPUB payment
                #${payment.tableIndex}`
            )
            throw e
          }
        }
      }}
    } catch (e) {
      console.error(
        `Problem finding the value paid to XPUB payment #${payment.tableIndex}`
      )
      throw e
    }
  }

  // convert to satoshi
  paymentTotal *= 100000000

  // increment total sales of the merchant
  await mysql.query(
    'UPDATE users SET totalSales = totalSales + ? WHERE merchantID = ? LIMIT 1',
    [paymentTotal, payment.merchantID]
  )

  // increment total sales of the merchant's platform (if they belong to one)
  let merchantPlatform = await mysql.query(
    'SELECT platformIndex FROM users WHERE merchantID = ? LIMIT 1',
    [payment.merchantID]
  )
  merchantPlatform = merchantPlatform[0].platformIndex
  if (!isNaN(merchantPlatform) && merchantPlatform > 0) {
    console.log(
      `XPUB payment #${payment.tableIndex} goes to a merchant who belongs to a platform`
    )
    await mysql.query(
      'UPDATE platforms SET totalSales = totalSales + ? WHERE tableIndex = ?',
      [paymentTotal, merchantPlatform]
    )
  }

  // execute the callback
  await executeCallback(payment)

  // mark payment as complete
  await mysql.query(
    'UPDATE payments SET status = ? WHERE tableIndex = ? LIMIT 1',
    ['complete', payment.tableIndex]
  )
}
