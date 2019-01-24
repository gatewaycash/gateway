/**
 * Broken payments Service
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Fixes broken payments, checking all addresses for funds
 */
import bchaddr from 'bchaddrjs'
import { mysql, getAddressBalance } from 'utils'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

// adds a payment to the pending payments queue unless it is already there
let addPending = async (payment) => {
  let legacyAddress = bchaddr.toLagacyAddress(payment.paymentAddress)
  let UTXOs = await axios.get(
    `${process.env.BLOCK_EXPLORER_BASE}/addr/${legacyAddress}/utxo`
  )
  UTXOs = UTXOs.data
  if (UTXOs.length < 1) {
    console.error(payment.legacyAddress, 'Balance but no UTXOs')
    return
  }
  for (let i = 0; i < UTXOs.length; i++) {
    let TXIDKnown = await mysql.query(
      'SELECT TXID FROM transactions WHERE TXID = ? LIMIT 1',
      [UTXOs[i].txid]
    )
    if (TXIDKnown.length !== 1) {
      await mysql.query(
        'INSERT INTO transactions (paymentIndex, TXID, type) VALUES (?, ?, ?)',
        [payment.tableIndex, UTXOs[i].txid, 'payment-brroken']
      )
    }
  }

  await mysql.query(
    'UPDATE payments SET status = ? WHERE tableIndex = ? LIMIT 1',
    ['pending', payment.tableIndex]
  )
}

let searchDatabase = async () => {
  console.log('Searching database for broken payments...')
  let result = await mysql.query(
    `SELECT *
      FROM payments
      WHERE
        status = ?
      ORDER BY created
      DESC`,
    ['clicked']
  )
  for(var i = 0; i < result.length; i++) {
    try {
      let balance = await getAddressBalance(result[i].paymentAddress)
      if (balance > 0) addPending(result[i])
    } catch (e) {
      console.error(
        `Trouble with broken payment #${result[i].tableIndex}`
      )
    }
  }
}

export default searchDatabase
