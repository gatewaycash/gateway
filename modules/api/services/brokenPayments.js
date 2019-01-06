/**
 * Broken payments Service
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Fixes broken payments, checking all addresses for funds
 */
const bchaddr = require('bchaddrjs')
const mysql = require('../SQLWrapper')
const axios = require('axios')
const sha256 = require('sha256')

const BLOCK_EXPLORER_BASE = 'https://bch.coin.space/api'

let checkFunds = async (payment) => {
  let legacyAddress
  try {
    legacyAddress = bchaddr.toLegacyAddress(payment.paymentAddress)
  } catch (e) {
    return
  }

  // find the combined balance of the payment address
  let requestURL = BLOCK_EXPLORER_BASE + '/addr/' + legacyAddress + '/balance'
  let confirmedBalance = await axios.get(requestURL)
  requestURL = BLOCK_EXPLORER_BASE + '/addr/' + legacyAddress
    + '/unconfirmedbalance'
  let unconfirmedBalance = await axios.get(requestURL)
  let balance = parseInt(unconfirmedBalance.data) +
    parseInt(confirmedBalance.data)

  if (balance > 0) {
    console.log(
      'Broken payments: Discovered broken payment:\n',
      'Address:',
      payment.paymentAddress,
      '\nBalance:',
      ( balance / 100000000 ),
      'BCH'
    )
    addPending(payment)
  } else {
    console.log('Balance', legacyAddress, balance)
  }
}

// adds a payment to the pending payments queue unless it is already there
let addPending = async (payment) => {

  // generate a random filler TXID
  // TODO discover the real TXID
  let txid = 'broken-transaction-txid-unknown-' + sha256(
    require('crypto').randomBytes(32)
  ).substr(0, 32)

  // search for the paymentAddress in pending
  let result = await mysql.query(
    'select address from pending where address like ? limit 1',
    [payment.paymentAddress]
  )
  if (result.length !== 0) {
    console.log(
      'Broken payment already pending:', payment.paymentAddress
    )
    return
  }

  // insert into the database
  var sql = 'insert into pending (txid, address) values (?, ?)'
  await mysql.query(sql, [txid, payment.paymentAddress])
  console.log('Broken payment added to pending payments queue')
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
    console.log('Checking', result[i].paymentAddress)
    await checkFunds(result[i])
  }
}

module.exports = {
  run: searchDatabase
}
