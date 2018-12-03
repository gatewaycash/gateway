const bch = require('bitcore-lib-cash')
const bchaddr = require('bchaddrjs')
const mysql = require('mysql')
const request = require('sync-request')
const sha256 = require('sha256')

/*

This daemon searches daily for any any balances left in addresses
controlled by Gateway. These transactions are recovered to their
respective merchants.

*/

class brokenPaymentsDaemon {

  constructor () {
    // connect to the database
    // TODO connect to database during each search instead of holding conn open
    console.log('Starting broken payments daemon...')
    this.conn = mysql.createConnection({
      host: process.env.SQL_DATABASE_HOST,
      user: process.env.SQL_DATABASE_USER,
      password: process.env.SQL_DATABASE_PASSWORD,
      database: process.env.SQL_DATABASE_DB_NAME
    })

    this.conn.connect((err) => {
      if (err) {
        throw err
      }
      this.searchDatabase() // run now
      setInterval(this.searchDatabase, 86400000) // run once a day
    })
  }
  
  // function for checking if address has funds
  checkFunds (payment) {
    
    // create a variable for legacy version of paymentAddress
    var legacy = bchaddr.toLegacyAddress(payment.paymentAddress)
    
    // get the balance of the paymentAddress
    // request both confirmed and unconfirmed balanes
    var requestURL = 'https://bitcoincash.blockexplorer.com/api/addr/'+legacy+'/balance'
    var result = request('GET', requestURL)
    var confirmedBalance = result.getBody().toString()
    requestURL = 'https://bitcoincash.blockexplorer.com/api/addr/'+legacy+'/unconfirmedbalance'
    result = request('GET', requestURL)
    var unconfirmedBalance = result.getBody().toString()
    
    // validate both balances are whole integers (satoshi)
    if (!isNaN(confirmedBalance) && !isNaN(unconfirmedBalance)) {
      var balance = parseInt(unconfirmedBalance) + parseInt(confirmedBalance)
      if (balance > 0) {
        console.log('non-zero balance for',legacy,balance)
        this.addPending(payment)
      }
    }
  }
  
  addPending (payment) {
    var txid = 'broken-transaction-txid-unknown-' + sha256(require('crypto').randomBytes(32)).toString().substr(0, 32)
    var sql = 'insert into pending (txid, address) values (?, ?)'
    this.conn.query(sql, [txid, payment.paymentAddress], (err, result) => {
      if (err) {
        throw err
      }
      console.log('added to pending')
    })
  }

  searchDatabase () {
    var query = 'select * from payments where transferTXID is null order by created desc'
    this.conn.query(query, (err, res) => {
      if (err) {
        throw err
      }
      for(var i = 0; i < res.length; i++) {
        this.checkFunds(res[i])
      }
    })
  }

}

module.exports = brokenPaymentsDaemon
