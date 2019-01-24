/**
 * Funds transfer daemon
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Provides a daemon for transfering funds
 */
import bch from 'bitcore-lib-cash'
import bchaddr from 'bchaddrjs'
import { mysql, getAddressBalance, executeCallback } from 'utils'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

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
    payment.addressBalance = balance
    try {
      await processPayment(payment)
      console.log(`Successfully forwarded payment #${payment.tableIndex}`)
    } catch (e) {
      console.error(`Error with payment #${payment.tableIndex}`)
    }
  } else {
    try {
      await processXPUB(payment)
      console.log(`XPUB payment #${payment.tableIndex} finished!`)
    } catch (e) {
      console.error(`Error with XPUB payment #${payment.tableIndex}`)
    }
  }
}

let processXPUB = async (payment) => {
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
            throw e
          }
        }
      }}
    } catch (e) {
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

  // execute the callback
  await executeCallback(payment)

  // mark payment as complete
  await mysql.query(
    'UPDATE payments SET status = ? WHERE tableIndex = ? LIMIT 1',
    ['complete', payment.tableIndex]
  )
}

let processPayment = async (payment) => {
  // get the merchant ID of the merchant for whom this payment is destined
  let sql = 'select merchantID from payments where paymentAddress = ? limit 1'
  let result = await mysql.query(sql, [payment.address])
  let merchantID = result[0].merchantID

  // get the payout address of the merchant
  sql = 'select payoutAddress from users where merchantID = ? limit 1'
  result = await mysql.query(sql, [merchantID])
  let merchantAddress = result[0].payoutAddress

  // get the full payment information
  sql = `select
    paymentKey,
    callbackURL,
    paymentID,
    paymentTXID
    from payments
    where
    paymentAddress = ?
    limit 1`
  result = await mysql.query(sql, [payment.address])
  result = result[0]
  let {
    paymentKey,
    callbackURL,
    paymentID
  } = result

  // set up some more variables to keep a handle on things
  let paymentAddress = payment.address
  let paymentAddressLegacy = bchaddr.toLegacyAddress(paymentAddress)
  let paymentTXID = payment.txid

  // find all the UTXOs for the payment address
  let paymentUTXOs = await axios.get(
    BLOCK_EXPLORER_BASE + '/addr/' + paymentAddressLegacy + '/utxo'
  )
  paymentUTXOs = paymentUTXOs.data
  console.log('Got', paymentAddressLegacy, paymentUTXOs.length, 'UTXOs')
  if (isNaN(paymentUTXOs.length) || paymentUTXOs.length <= 0) {
    console.error('No UTXOs, aborting.')
    return
  }

  /*
    Create a BCH transaction spending the payment UTXOs to the merchant address
    (and to Gateway if they elect to contribute)
   */
  let transferTransaction = new bch.Transaction()
  let totalTransferred = 0

  // the inputs for this transaction are the UTXOs from the payment address
  for(var i = 0, l = paymentUTXOs.length; i < l; i++) {
    transferTransaction.from({
      'txid': paymentUTXOs[i].txid,
      'vout': paymentUTXOs[i].vout,
      'address': bchaddr.toCashAddress(paymentUTXOs[i].address),
      'scriptPubKey': paymentUTXOs[i].scriptPubKey,
      'amount': paymentUTXOs[i].amount
    })
    totalTransferred += (paymentUTXOs[i].amount * 100000000)
  }

  // round the totalTransferred to be Satoshis
  totalTransferred = totalTransferred.toFixed(0)
  console.log('Added UTXOs, total', ( totalTransferred / 100000000 ), 'BCH')

  // TODO: optional Gateway contributions
  // to bitcoincash:pz3txlyql9vc08px98v69a7700g6aecj5gc0q3xhng
  transferTransaction.to(
    bchaddr.toCashAddress(merchantAddress),
    totalTransferred - 200
  )
  transferTransaction.fee(200)
  transferTransaction.sign(bch.PrivateKey.fromWIF(paymentKey))
  let rawTransferTransaction = transferTransaction.toString()
  console.log('Transfer Transaction:\n\n' + rawTransferTransaction + '\n')

  /*
    Broadcast transaction to multiple places
  */

  // Our current block explorer
  let transferTXID = await axios.post(
    BLOCK_EXPLORER_BASE + '/tx/send',
    {
      rawtx: rawTransferTransaction
    }
  )
  transferTXID = transferTXID.data.txid

  // Bitcoin.com block explorer
  await axios.post(
    'https://api.blockchair.com/bitcoin-cash/push/transaction',
    {
      data: rawTransferTransaction
    }
  )

  // Print the payment information
  console.log('Transfer TXID:\n' + transferTXID + '\n')
  console.log('Payment Address:\n' + paymentAddress + '\n')
  console.log('Payment TXID:\n' + paymentTXID + '\n')
  console.log('Amount Paid: ' + (totalTransferred / 100000000) + ' BCH' + '\n')

  // delete transaction from pending
  sql = 'delete from pending where txid = ?'
  await mysql.query(sql, [payment.txid])

  // update payments with new data
  sql = `update payments
    set paymentTXID = ?,
    paidAmount = ?,
    transferTXID = ?
    where
    paymentAddress = ?
    limit 1`
  await mysql.query(
    sql,
    [payment.txid, totalTransferred, transferTXID, payment.address]
  )

  // increment the total sales of the merchant
  sql = 'update users set totalSales = totalSales + ? where merchantID = ?'
  await mysql.query(sql, [totalTransferred, merchantID])


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
