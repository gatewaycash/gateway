/**
 * Broken payments Service
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Fixes broken payments, checking all addresses for funds
 */
const bchaddr = require('bchaddrjs')
const mysql = require('../SQLWrapper')
const axios = require('axios')

const BLOCK_EXPLORER_BASE = 'https://bch.coin.space/api'

let checkFunds = async (payment) => {
  let legacyAddress
  try {
    legacyAddress = bchaddr.toLegacyAddress(payment.paymentAddress)
  } catch (e) {
    // delete the payment with the erroneous paymentAddress
    console.error('Untranslatable address', payment.paymentAddress, 'removing')
    await mysql.query(
      'delete from payments where paymentAddress = ?',
      [payment.paymentAddress]
    )
    return
  }

  // find the confirmed balance of legacyAddress
  try {
    let requestURL = BLOCK_EXPLORER_BASE + '/addr/' + legacyAddress + '/balance'
    let confirmedBalance = await axios.get(requestURL)
    let balance = parseInt(confirmedBalance.data)

    // log the balance and run addPending if non-zero
    console.log('Balance', legacyAddress, ( balance / 100000000 ), 'BCH')
    if (balance > 0) {
      payment.legacyAddress = legacyAddress
      try {
        await addPending(payment)
      } catch (e) {
        console.error('Add pending failed', legacyAddress)
        console.error(e)
      }
    }
  } catch (e) {
    console.error('Issue requesting balance', legacyAddress)
    console.error(e)
  }
}

// adds a payment to the pending payments queue unless it is already there
let addPending = async (payment) => {
  // discover the TXID of the broken payment
  let UTXOs = await axios.get(
    BLOCK_EXPLORER_BASE + '/addr/' + payment.legacyAddress + '/utxo'
  )
  UTXOs = UTXOs.data
  if (UTXOs.length < 1) {
    console.error(payment.legacyAddress, 'Balance but no UTXOs')
    return
  }
  let txid = UTXOs[0].txid

  // ensure paymentAddress is not pending
  let result = await mysql.query(
    'select address from pending where address like ? limit 1',
    [payment.paymentAddress]
  )
  if (result.length !== 0) {
    console.log(payment.legacyAddress, 'already pending')
    return
  }

  // append to pending
  var sql = 'insert into pending (txid, address) values (?, ?)'
  await mysql.query(sql, [txid, payment.paymentAddress])
  console.log(payment.legacyAddress, 'fixed')
}

let searchDatabase = async () => {
  console.log('Searching database for broken payments...')
  let sql = `select *
    from payments
    where
    transferTXID is null
    order by created
    desc`
  let result = await mysql.query(sql)
  for(var i = 0; i < result.length; i++) {
    await checkFunds(result[i])
  }
}

module.exports = {
  run: searchDatabase
}
