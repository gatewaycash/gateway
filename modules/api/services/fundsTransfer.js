/**
 * Funds transfer daemon
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Provides a daemon for transfering funds
 */
const bch = require('bitcore-lib-cash')
const bchaddr = require('bchaddrjs')
const mysql = require('../SQLWrapper')
const axios = require('axios')

const BLOCK_EXPLORER_BASE = 'https://bch.coin.space/api'

let checkFunds = async (payment) => {
  let legacyAddress
  try {
    legacyAddress = bchaddr.toLegacyAddress(payment.address)
  } catch (e) {
    console.log('Invalid address, aborting', payment.address)
    return
  }

  try {
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
        'Non-zero balance for payment:\n',
        'Address:',
        payment.address,
        '\nBalance:',
        ( balance / 100000000 ),
        'BCH'
      )
      await transferFunds(payment)
    } else {
      console.log('Balance', payment.address, balance)
    }
  } catch (e) {
    console.log(
      'Error checking or transferring funds for',
      payment.address
    )
    console.log(e)
  }
}

let transferFunds = async (payment) => {
  // get the merchant ID of the merchant for whom this payment is destined
  let sql = 'select merchantID from payments where paymentAddress = ? limit 1'
  let result = await mysql.query(sql, [payment.address])
  let merchantID = result[0].merchantID

  // get the payout address of the merchant
  sql = 'select payoutAddress from users where merchantID = ? limit 1'
  result = await mysql.query(sql, [merchantID])
  let merchantAddress = result[0].payoutAddress
  console.log('Merchant address:', merchantAddress)

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
  console.log('Got payment key, length', paymentKey.length)

  // set up some more variables to keep a handle on things
  let paymentAddress = payment.address
  let paymentAddressLegacy = bchaddr.toLegacyAddress(paymentAddress)
  let paymentTXID = payment.txid

  // find all the UTXOs for the payment address
  let paymentUTXOs = await axios.get(
    BLOCK_EXPLORER_BASE + '/addr/' + paymentAddressLegacy + '/utxo'
  )
  paymentUTXOs = paymentUTXOs.data
  console.log('Got', paymentUTXOs.length, 'payment UTXOs')
  if (isNaN(paymentUTXOs.length) || paymentUTXOs.length <= 0) {
    console.log('No UTXOs for payment')
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
  console.log('Added UTXOs to the transfer transaction')

  // round the totalTransferred to be Satoshis
  totalTransferred = totalTransferred.toFixed(0)

  // TODO: optional Gateway contributions
  // to bitcoincash:pz3txlyql9vc08px98v69a7700g6aecj5gc0q3xhng
  transferTransaction.to(
    bchaddr.toCashAddress(merchantAddress),
    totalTransferred - 200
  )
  transferTransaction.fee(200)
  transferTransaction.sign(bch.PrivateKey.fromWIF(paymentKey))
  let rawTransferTransaction = transferTransaction.toString()
  console.log('Raw transaction:\n\n', rawTransferTransaction)

  // broadcast transaction to multiple places
  // our current block explorer
  let transferTXID = await axios.post(
    BLOCK_EXPLORER_BASE + '/tx/send',
    {
      rawtx: rawTransferTransaction
    }
  )
  transferTXID = transferTXID.data.txid
  console.log('Broadcasted, TXID:', transferTXID)
  // bitcoin.com block explorer
  await axios.post(
    'https://api.blockchair.com/bitcoin-cash/push/transaction',
    {
      data: rawTransferTransaction
    }
  )

  // print the payment information
  console.log('Transfer TXID:   ', transferTXID)
  console.log('Payment Address: ', paymentAddress)
  console.log('Payment TXID:    ', paymentTXID)
  console.log('Amount Paid:     ', totalTransferred)

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

  // we are done if there is not a callbackUrL
  if (!callbackURL) {
    return
  }

  // build the callback request
  let callbackRequest = {
    callbackURL:     callbackURL,
    invoiceAddress:  paymentAddress,
    paymentTXID:     paymentTXID,
    merchantAddress: merchantAddress,
    paymentID:       paymentID
  }

  // verify the callback URL is sane. If not, we are done and we return.
  if (
    !callbackURL.startsWith('https://') &&
    !callbackURL.startsWith('http://')
  ) {
    console.log(
      'Unable to execute callback to URL:',
      callbackURL
    )
    return
  }

  // try to execute the callback
  try {
    await axios.post(callbackRequest.callbackURL, callbackRequest)
  } catch (e) {
    console.log(
      'Unable to execute callback to URL:',
      callbackRequest.callbackURL
    )
    return
  }
  console.log(
    'Successfully executed callback to URL',
    callbackRequest.callbackURL
  )
}

let searchDatabase = async () => {
  let sql = 'select * from pending'
  let result = await mysql.query(sql)
  for(var i = 0; i < result.length; i++) {
    console.log(
      'Processing payment',
      '\nTXID:',
      result[i].txid
    )
    await checkFunds(result[i])
  }
}


module.exports = {
  run: searchDatabase
}
