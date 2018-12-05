/**
 * Funds transfer daemon
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Provides a daemon for transfering funds
 */
const bch = require('bitcore-lib-cash')
const bchaddr = require('bchaddrjs')
const mysql = require('mysql')
const request = require('sync-request')

/**
 * This file checks the database for new Gateway transactions,
 * moving them to the merchants and logging them in the database
 * every 60 seconds.
 */
class fundsTransferDaemon {

  /**
   * @constructor
   * Starts the funds transfer daemon
   */
  constructor () {
    // print startup message
    console.log('Starting funds transfer daemon...')
    // scan database immediately
    this.searchDatabase()
    // scan database every 60 seconds
    setInterval(this.searchDatabase, 60000)
  }

  /**
   * Checks if an address has a balance
   * @param  {object} payment SQL record of the payment
   */
  checkFunds (payment) {
    /** a variable for legacy version of paymentAddress */
    const legacy = bchaddr.toLegacyAddress(payment.address)
    // get balance of payment address
    // request both confirmed and unconfirmed balanes
    var requestURL = 'https://bitcoincash.blockexplorer.com/api/addr/'
      + legacy
      + '/balance'
    var result = request('GET', requestURL)
    const confirmedBalance = result.getBody().toString()
    requestURL = 'https://bitcoincash.blockexplorer.com/api/addr/'
      + legacy
      + '/unconfirmedbalance'
    result = request('GET', requestURL)
    const unconfirmedBalance = result.getBody().toString()
    // balances are in denominations of satoshi
    // validate both balances are whole integers
    if (!isNaN(confirmedBalance) && !isNaN(unconfirmedBalance)) {
      const balance = parseInt(unconfirmedBalance) + parseInt(confirmedBalance)
      // if the address has a balance, send funds to the merchant
      if (balance > 0) {
        console.log(
          'non-zero balance for',
          payment.address,
          ( balance / 100000000 ),
          'BCH'
        )
        this.transferFunds(payment)
      }
    } else {
      // something from the request was incorrect
      console.log('Balance was not a number for address:',legacy)
    }
  }

  // transfers funds to the merchant's address
  transferFunds (payment) {
    // get merchantID of merchant
    var sql = 'select merchantID from payments where paymentAddress = ?'
    conn.query(sql, [payment.address], (err, result) => {
      if (err) { throw err }
      var merchantID = result[0].merchantID
      // get the address of the merchant
      var sql = 'select payoutAddress from users where merchantID = ?'
      conn.query(sql, [merchantID], (err, result) => {
        if (err) {
          throw err
        }
        var toAddress = result[0].payoutAddress
        toAddress = bchaddr.toLegacyAddress(toAddress)

        // get the private key
        var sql = 'select paymentKey, callbackURL, paymentID, paymentTXID from payments where paymentAddress = ?'
        this.conn.query(sql, [payment.address], (err, result) => {
          var paymentKey = result[0].paymentKey.toString()
          var callbackURL = result[0].callbackURL.toString()
          var paymentID = result[0].paymentID.toString()

          // get all UTXOs for address
          var fromAddress = bchaddr.toLegacyAddress(payment.address)
          var requestURL = 'https://bitcoincash.blockexplorer.com/api/addr/'+fromAddress+'/utxo'
          var utxo = request('GET', requestURL).getBody().toString()
          utxo = JSON.parse(utxo)

          // create BCH transaction
          var tx = new bch.Transaction()
          var totalTransferred = 0
          for(var i = 0, l = utxo.length; i < l; i++) {
            tx.from({
              "txid": utxo[i].txid,
              "vout": utxo[i].vout,
              "address": bchaddr.toLegacyAddress(utxo[i].address),
              "scriptPubKey": utxo[i].scriptPubKey,
              "amount": utxo[i].amount
            })
            totalTransferred += utxo[i].amount
          }
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

  /**
   * Searches database for unprocessed payments
   */
  searchDatabase () {
    const conn = mysql.createConnection({
      host:     process.env.SQL_DATABASE_HOST,
      user:     process.env.SQL_DATABASE_USER,
      password: process.env.SQL_DATABASE_PASSWORD,
      database: process.env.SQL_DATABASE_DB_NAME
    })
    conn.connect((err) => {
      if (err) {
        throw err
      }
      var sql = `select *
        from pending
        order by created
        desc`
      conn.query(sql, (err, res) => {
        if (err)  {
          throw err
        }
        for(var i = 0; i < res.length; i++) {
          console.log(
            'Processing payment',
            '\nTXID:',
            res[i].txid
          )
          this.checkFunds(res[i])
        }
        conn.close()
      })
    })
  }

}

module.exports = fundsTransferDaemon
