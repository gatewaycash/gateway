/**
 * Broken payments Daemon
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Fixes broken payments, checking all addresses for funds
 */
const bch = require('bitcore-lib-cash')
const bchaddr = require('bchaddrjs')
const mysql = require('mysql')
const request = require('sync-request')
const sha256 = require('sha256')
require('dotenv').config()
/**
 * This daemon searches daily for any any balances left in addresses
 * controlled by Gateway. These transactions are recovered to their
 * respective merchants.
 */
class brokenPaymentsDaemon {

  /**
   * @constructor
   * Starts the broken payments daemon
   */
  constructor () {
    // print startup message
    console.log('Starting broken payments daemon...')
    // search the database immediately
    this.searchDatabase()
    // search the database once a day
    setInterval(this.searchDatabase, 86400000)
  }

  /**
   * Checks if an address has funds which need to be transferred to a merchant
   * @param  {object} payment SQL record containing the payment information
   */
  checkFunds (payment) {
    /** A variable for legacy version of the payment address */
    const legacy = bchaddr.toLegacyAddress(payment.paymentAddress)

    // find the balance of the payment address
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

    // received balances are in deniminations of satoshi
    // validate both balances are whole integers
    if (!isNaN(confirmedBalance) && !isNaN(unconfirmedBalance)) {
      const balance = parseInt(unconfirmedBalance) + parseInt(confirmedBalance)
      // if an address has a balance, add it to the pending payments queue
      if (balance > 0) {
        console.log(
          'Broken payments: Discovered broken payment:\n',
          'Address:',
          payment.paymentAddress,
          '\nBalance:',
          ( balance / 100000000 ),
          'BCH'
        )
        this.addPending(payment)
      }
    }
  }

  /**
   * Once a broken payment has been found, adds it to the queue of payments to
   * be processed. These payments are then picked up by the funds transfer
   * daemon like any other payments.
   */
  addPending (payment) {
    var txid = 'broken-transaction-txid-unknown-'
      + sha256 (
        require('crypto').randomBytes(32)
      )
      .toString()
      .substr(0, 32)
    const conn = mysql.createConnection({
      host:     process.env.SQL_DATABASE_HOST,
      user:     process.env.SQL_DATABASE_USER,
      password: process.env.SQL_DATABASE_PASSWORD,
      database: process.env.SQL_DATABASE_DB_NAME
    })
    var sql = `insert into pending
      (txid, address)
      values
      (?, ?)`
    conn.query(sql, [txid, payment.paymentAddress], (err, result) => {
      if (err) {
        throw err
      }
      console.log('Broken payment added to pending payments queue')
      conn.close()
    })
  }

  /**
   * Searches database for broken payments.
   * Addresses of payment requests which do not have a transfer TXID are scanned
   * for funds, most recent records first.
   */
  searchDatabase () {
    console.log('Searching database for broken payments...')
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
        from payments
        where
        transferTXID is null
        order by created
        desc`
      conn.query(sql, (err, res) => {
        if (err) {
          throw err
        }
        for(var i = 0; i < res.length; i++) {
          this.checkFunds(res[i])
        }
        conn.close()
      })
    })
  }

}

module.exports = brokenPaymentsDaemon
