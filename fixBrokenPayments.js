const bch = require('bitcoincashjs')
const bchaddr = require('bchaddrjs')
const mysql = require('mysql')
const request = require('sync-request')
const sha256 = require('sha256')

// function for checking if address has funds
var checkFunds = (payment) => {
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
      addPending(payment)
    }
  } else {
    // something from the request was incorrect
    console.log('Balance was not a number for address:',legacy)
  }
}

var addPending = (payment) => {
  var txid = 'broken-transaction-txid-unknown-' + sha256(require('crypto').randomBytes(32)).toString().substr(0, 32)
  var sql = 'insert into pending (txid, address) values (?, ?)'
  conn.query(sql, [txid, payment.paymentAddress], (err, result) => {
    if (err) { throw err }
    console.log('added to pending')
  })
}

searchDatabase = () => {
  console.log('Checking database')
  var query = 'select * from payments where transferTXID is null order by created desc'
  conn.query(query, (err, res) => {
    if (err)  { throw err }
    for(var i = 0; i < res.length; i++) {
      console.log('Checking payment with address', res[i].paymentAddress)
      checkFunds(res[i])
    }
  })
}

// connect to database
var conn = mysql.createConnection({
  host: 'localhost',
  user: 'gateway',
  password: 'gateway123',
  database: 'gateway'
})

conn.connect((err) => {
  if (err) { throw err }
  console.log('connected to database')
  searchDatabase() // run now
  setInterval(searchDatabase, 86400000) // run once a dat
})
