const bch = require('bitcoincashjs')
const bchaddr = require('bchaddrjs')
const mysql = require('mysql')
const request = require('sync-request')

// function for checking if address has funds
var checkFunds = (payment) => {
  // create a variable for legacy version of paymentAddress
  var legacy = bchaddr.toLegacyAddress(payment.address)
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
      transferFunds(payment)
    }
  } else {
    // something from the request was incorrect
    console.log('Balance was not a number for address:',legacy)
  }
}

// function to transfer funds to merchant adress
var transferFunds = (payment) => {
  // gett merchantID of merchant
  var sql = 'select merchantID from payments where paymentAddress = ?'
  conn.query(sql, [payment.address], (err, result) => {
    if (err) { throw err }
    var merchantID = result[0].merchantID
    // get the address of the merchant
    var sql = 'select payoutAddress from users where merchantID = ?'
    conn.query(sql, [merchantID], (err, result) => {
      if (err) { throw err }
      var toAddress = result[0].payoutAddress
      toAddress = bchaddr.toLegacyAddress(toAddress)
      console.log('Ientified merchant address as',toAddress)
      // get the private key
      var sql = 'select paymentKey from payments where paymentAddress = ?'
      conn.query(sql, [payment.address], (err, result) => {
        var paymentKey = result[0].paymentKey.toString()
        console.log('got payment key, length ', paymentKey.length)
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
        transferTXID = JSON.parse(transferTXID).txid
        totalTransferred = totalTransferred * 100000000
        console.log('transferTXID', transferTXID)
        console.log('paymentAddress', fromAddress)
        console.log('paymentTXID', payment.txid)
        console.log('amountPaid', totalTransferred)
        // delete transaction from pending
        var sql = 'delete from pending where txid = ?'
        conn.query(sql, [payment.txid], (err, result) => {
          if (err) { throw err }
          console.log('deleted from pending')
          // update payments with new data
          var sql = 'update payments set paymentTXID = ?, paidAmount = ?, transferTXID = ? where paymentAddress = ?'
          conn.query(sql, [payment.txid, totalTransferred, transferTXID, payment.address], (err, result) => {
            if (err) { throw err }
            console.log('updated payment record')
            // increment the total sales of the merchant
            var sql = 'update users set totalSales = totalSales + ? where merchantID = ?'
            conn.query(sql, [totalTransferred, merchantID], (err, result) => {
              if (err) { throw err }
              console.log('ok')
            })
          })
        })
      })
    })
  })
}

searchDatabase = () => {
  console.log('checking for payments')
  var query = 'select * from pending order by created desc'
  conn.query(query, (err, res) => {
    if (err)  { throw err }
    for(var i = 0; i < res.length; i++) {
      console.log('Checking payment with txid', res[i].txid)
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
  // run immediately
  searchDatabase()
  setInterval(searchDatabase, 600000) // run every 10 minutes
})
