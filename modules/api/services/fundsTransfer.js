/**
 * Funds transfer daemon
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Provides a daemon for transfering funds
 */
const bch = require('bitcore-lib-cash')
const bchaddr = require('bchaddrjs')
const mysql = require('mysql')
const axios = require('axios')

const BLOCK_EXPLORER_BASE = 'https://bch.coin.space/api'

let checkFunds = async (payment) => {
  let legacyAddress
  try {
    legacyAddress = bchaddr.toLegacyAddress(payment.paymentAddress)
  } catch (e) {
    return
  }

  // find the combined balance of the payment address
  let requestURL = BLOCK_EXPLORER_BASE + '/addr/' + legacy + '/balance'
  let confirmedBalance = await axios.get(requestURL).data
  requestURL = BLOCK_EXPLORER_BASE + '/addr/' + legacy + '/unconfirmedbalance'
  let unconfirmedBalance = await axios.get(requestURL).data
  let balance = parseInt(unconfirmedBalance) + parseInt(confirmedBalance)

  if (balance > 0) {
    console.log(
      'Non-zero balance for payment:\n',
      'Address:',
      payment.paymentAddress,
      '\nBalance:',
      ( balance / 100000000 ),
      'BCH'
    )
    transferFunds(payment)
  }
}

let transferFunds = async (payment) => {
  // get the merchant ID of the merchant for whom this payment is destined
  let sql = 'select merchantID from payments where paymentAddress = ? limit 1'
  let merchantID = await mysql.query(sql, [payment.address])[0].merchantID

  // get the payout address and API key of the merchant
  sql = 'select payoutAddress, APIKey from users where merchantID = ? limit 1'
  let merchantAddress = await mysql.query(sql, [merchantID])[0].payoutAddress

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
  let {
    paymentKey,
    callbackURL,
    paymentID
  } = await mysql.query(sql, [payment.address])[0]

  // set up some more variables to keep a handle on things
  let paymentAddress = payment.address
  let paymentAddressLegacy = bchaddr.toLegacyAddress(paymentAddress)
  let paymentTXID = payment.txid

  // find all the UTXOs for the payment address
  let paymentUTXOs = await axios.get(
    BLOCK_EXPLORER_BASE + '/addr/' + paymentAddressLegacy + '/utxo'
  ).data

  /*
    Create a BCH transaction spending the payment UTXOs to the merchant address
    (and to Gateway if they elect to contribute)
   */
  let transferTransaction = new bch.Transaction()
  let totalTransferred = 0
  // the inputs for this transaction are the UTXOs from the payment address
  for(var i = 0, l = paymentUTXOs.length; i < l; i++) {
    transferTransaction.from({
      "txid": paymentUTXOs[i].txid,
      "vout": paymentUTXOs[i].vout,
      "address": bchaddr.toLegacyAddress(paymentUTXOs[i].address),
      "scriptPubKey": paymentUTXOs[i].scriptPubKey,
      "amount": paymentUTXOs[i].amount
    })
    totalTransferred += paymentUTXOs[i].amount
  }

          //////////

          tx.to(toAddress, tx.inputAmount - 200)
          tx.fee(200)
          tx.sign(bch.PrivateKey.fromWIF(paymentKey))
          console.log('raw transaction', tx.toString())

          // broadcast transaction to multiple places
          var transferTXID = request('POST', 'https://bitcoincash.blockexplorer.com/api/tx/send', {
            headers: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            body: 'rawtx=' + tx.toString()
          }).getBody().toString()
          request('POST', 'https://rest.bitcoin.com/rawtransactions/sendRawTransaction/' + tx.toString(), {
            headers: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            body: 'rawtx=' + tx.toString()
          })

          // find the transfer TXID
          transferTXID = JSON.parse(transferTXID).txid
          totalTransferred = totalTransferred * 100000000
          console.log('transferTXID', transferTXID)
          console.log('paymentAddress', fromAddress)
          console.log('paymentTXID', payment.txid)
          console.log('amountPaid', totalTransferred)

          // delete transaction from pending
          var sql = 'delete from pending where txid = ?'
          this.conn.query(sql, [payment.txid], (err, result) => {
            if (err) {
              throw err
            }

            // update payments with new data
            var sql = 'update payments set paymentTXID = ?, paidAmount = ?, transferTXID = ? where paymentAddress = ?'
            this.conn.query(sql, [payment.txid, totalTransferred, transferTXID, payment.address], (err, result) => {
              if (err) {
                throw err
              }

              // increment the total sales of the merchant
              var sql = 'update users set totalSales = totalSales + ? where merchantID = ?'
              this.conn.query(sql, [totalTransferred, merchantID], (err, result) => {
                if (err) {
                  throw err
                }
                if (callbackURL !== 'None') {

                // build the callback string
                var callbackString = 'paymentTXID=' + payment.txid
                callbackString += '&transferTXID=' + transferTXID
                callbackString += '&amount=' + totalTransferred
                callbackString += '&paymentID=' + + paymentID
                callbackString += '&merchantID=' + merchantID
                callbackString += '&paymentAddress=' + fromAddress
                console.log('callback string', callbackString)

                // call the callback URL
                request('POST', callbackURL, {
                  headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  body: callbackString
                })
              }
            })
          })
        })
      })
    })
  })
}

let executeCallback = async (payment) => {

}

let searchDatabase = async () => {
  let sql = 'select * from pending order by created desc'
  let result = mysql.query(sql)
  for(var i = 0; i < res.length; i++) {
    console.log(
      'Processing payment',
      '\nTXID:',
      res[i].txid
    )
    checkFunds(res[i])
  }
}


module.exports = {
  run: searchDatabase
}
