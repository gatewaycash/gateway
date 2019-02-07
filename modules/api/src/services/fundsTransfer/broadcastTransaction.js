/**
 * Broadcasts a Bitcoin Cash transaction to multiple places
 * @license AGPL-3.0
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a function for broadcasting BCH transactions
 * @param {object} transaction - A bitcore-lib-cash Transaction object
 * @param {number} paymentIndex - An index from the payments table
 * @return {string} the resulting TXID if successful, otherwise throws an error
 */
import axios from 'axios'
import validateTXID from 'utils'
import dotenv from 'dotenv'
dotenv.config()

export default async (transaction, paymentIndex) => {
  // check if paymentIndex was given
  if (!paymentIndex) {
    paymentIndex = 'U-' + Math.round(Math.random() * 1000000)
    console.log(
      `No payment index provided to transaction broadcast function, using #${paymentIndex}`
    )
  }

  // serialize the transaction
  let rawTransactionHex
  try {
    rawTransactionHex = transaction.serialize()
  } catch (e) {
    console.error(
      `Payment #${paymentIndex}: Error serializing transaction before broadcast`
    )
    throw e
  }

  // define an array to hold the resulting TXIDs from each broadcast
  let TXIDs = []
  let broadcastResult

  // broadcast to our current block explorer
  broadcastResult = await axios.post(
    `${process.env.BLOCK_EXPLORER_BASE}/tx/send`,
    {
      rawtx: rawTransactionHex
    }
  )

  // check if the broadcast was successful
  if (broadcastResult.data.txid) {
    TXIDs.push(broadcastResult.data.txid)
  } else {
    console.error(
      `Payment #${paymentIndex}: Error broadcasting transaction to ${process.env.BLOCK_EXPLORER_BASE}\n`,
      broadcastResult.data
    )
  }

  // blockchair.com block explorer
  broadcastResult = await axios.post(
    'https://api.blockchair.com/bitcoin-cash/push/transaction',
    {
      data: rawTransactionHex
    }
  )

  // check if the broadcast was successful
  if (broadcastResult.data.txid) {
    TXIDs.push(broadcastResult.data.txid)
  } else {
    console.error(
      `Payment #${paymentIndex}: Error broadcasting transaction to https://api.blockchair.com\n`,
      broadcastResult.data
    )
  }

  // make sure the TXIDs array is not empty
  if (TXIDs.length < 1) {
    console.error(`Payment #${paymentIndex}: Error while broadcasting: No valid TXIDs returned`)
    throw 'no TXIDs from broadcast'
  }

  // make sure all the TXIDs are the same
  if (!TXIDs.every(x => x === TXIDs[0])) {
    console.error(`Payment #${paymentIndex}: TXIDs do not match after broadcast:\n`, TXIDs)
    throw 'TXID mismatch'
  }

  // make sure the TXID is valid
  let TXIDValid = validateTXID(TXIDs[0])
  if (!TXIDValid) {
    console.error(
      `Payment #${paymentIndex}: Invalid TXID after broadcast:\n`, TXIDs[0]
    )
  }

  // return the TXID
  return TXIDs[0]
}
