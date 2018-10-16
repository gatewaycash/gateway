/**
 * Gateway Server
 * @author Ty Everett <ty@tyweb.us>
 * @file Defines the entry point for the Gateway web server
 */

const express = require('express')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const bodyParser = require('body-parser')
const url = require('url')
const sha256 = require('sha256')
const mysql = require('mysql')
const BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default
const bch = new BITBOXCli()

// define the app
const app = express()

// se up bodyParser tor form data handling
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// set up persistant session
app.use(session({
  name: 'gateway-session',
  secret: 'sajdfpaioewypjmpasodjw,adfjwoiejfo',
  saveUninitialized: true,
  resave: true,
  store: new FileStore()
}))

// enable CORS to allow for API calls from other sites
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// serve the public directory's static resources
app.use(express.static('public'))

// listen on port 8080
app.listen(8080, () => {
  console.log('Gateway listening on port 8080')
})

// connect to the database
var conn = mysql.createConnection({
  host: 'localhost',
  user: 'gateway',
  password: 'gateway123',
  database: 'gateway'
})
conn.connect((err) => {
  if (err) { throw err }
})


app.post('/api/register', (req, res) => {
  if (!req.session.address || req.session.address.length < 20) {
    res.send('Make sure to give an address before trying to register')
  }else if (!bch.Address.isCashAddress(req.session.address)) {
    res.send('Make sure the provided addres is a valid CashAddress!')
  } else if (!req.body.password) {
    res.send('Please provide a password')
  } else if (req.body.password.length < 12) {
    res.send('Password must be at least 12 characters')
  } else if (req.body.password.toString().indexOf(' ') !== -1) {
    res.send('No spaces are allowed in your password')
  } else {
    // initial checks passed, make sure address is not in the database already
    var sql = 'select payoutAddress from users where payoutAddress = ?'
    conn.query(sql, [req.session.address], (err, result) => {
      if (err) { throw err }
      if (result.length !== 0) {
        res.send('This address has already been registered')
      } else {
        // no duplicate found, create a new row in the database
        var merchantID = sha256(req.session.address).substr(0, 16)
        var passwordSalt = sha256(require('crypto').randomBytes(32))
        var passwordHash = sha256(req.body.password + passwordSalt)
        var sql = 'insert into users (payoutAddress, merchantID, password, salt) values (?, ?, ?, ?)'
        conn.query(sql, [req.session.address, merchantID, passwordHash, passwordSalt], (err, result) => {
          if (err) { throw err }
          // registration complete, set up session and print OK message
          req.session.merchantID = merchantID
          req.session.username = ''
          req.session.loggedIn = true
          res.send('ok')
        })
      }
    })
  }
})

app.get('/api/login', (req, res) => {
  // parse the provided data
  const query = url.parse(req.url, true).query
  if (query.type !== 'address' && query.type !== 'username') {
    res.send('Error: invalid type (must be address or username)')
  } else if (query.type === 'address') { // log in by addresss
    // a variable to hold the converted and valid addresss
    var address = false
    // make sure provided address is valid
    try {
      if (!bch.Address.isCashAddress(query.value) &&
          !bch.Address.isLegacyAddress(query.value)) { // invalid address
        res.send('Error: Invalid address (please use CashAddr or Legacy)')
      } else if (bch.Address.isCashAddress(query.value)) { // cash address
        address = query.value
        // check if prefix was given
        if (!address.startsWith('bitcoincash:')) {
          address = 'bitcoincash:'+address
        }
      } else { // legacy address
        address = bch.Address.toCashAddress(query.value, true)
      }
    } catch (e) {
      res.send('Invalid address (use CashAddr or Legacy)')
    }
    if (address !== false) {
      // search the database for the given address
      var sql = 'select payoutAddress from users where payoutAddress = ?'
      conn.query(sql, [address], (err, result) => {
        if (err) { throw err }
        // save the address to persistant session
        req.session.address = address
        if (result.length !== 1) {
          res.send('register')
        } else {
          res.send('login')
        }
      })
    }
  } else { // log in by username
    if (query.value.length < 10) {
      res.send('No match')
    } else {
      var sql = 'select username from users where username = ?'
      conn.query(sql, [query.value], (err, result) => {
        if (result.length !== 1) {
          res.send('No match')
        } else {
          res.send('login')
        }
      })
    }
  }
})

app.get('/api/password', (req, res) => {
  // parse the provided data
  const query = url.parse(req.url, true).query
  if (!req.session.address && !req.session.username) {
    res.send('Provide an address or username first')
  } else if (query.password.length < 12) {
    res.send('Incorrect password')
  } else if (req.session.address) { // prefer logging in by address
    var sql = 'select * from users where payoutAddress = ?'
    conn.query(sql, [req.session.address], (err, result) => {
      if (err) { throw err }
      if (result.length !== 1) {
        res.send('Incorrect address')
      } else {
        var user = result[0]
        var passwordHash = sha256(query.password + user.salt)
        if (user.password === passwordHash) {
          // login successful, set up session variables
          req.session.address = user.payoutAddress
          req.session.username = user.username
          req.session.merchantID = user.merchantID
          req.session.loggedIn = true
          res.send('ok')
        } else {
          res.send('Incorrect password')
        }
      }
    })
  } else { // search by username
    var sql = 'select * from users where username = ?'
    conn.query(sql, [res.session.username], (err, result) => {
      if (err) { throw err }
      if (result.length !== 1) {
        res.send('Incorrect username')
      } else {
        var user = result[0]
        var passwordHash = sha256(query.password + user.salt)
        if (user.password === passwordHash) {
          // login successful, set up session variables
          req.session.address = user.payoutAddress
          req.session.username = user.username
          req.session.merchantID = user.merchantID
          req.session.loggedIn = true
          res.send('ok')
        } else {
          res.send('Incorrect password')
        }
      }
    })
  }
})

app.get('/api/pay', (req, res) => {
  const query = url.parse(req.url, true).query
  if (!query.merchantID || !query.paymentID) {
    res.send('MerchantID and PaymentID not provided!')
  } else if (query.merchantID.length !== 16){
    res.send('Invalid MerchantID')
  } else if (query.paymentID.length > 32) {
    res.send('PaymentID cannot be longer than 32 characters')
  }else{
    // initial checks pased, verify merchantID exists
    var sql = 'select merchantID from users where merchantID = ?'
    conn.query(sql, [query.merchantID], (err, result) => {
      if (result.length !== 1) {
        res.send('Invalid MerchantID')
      } else {
        // generate a new address and private key
        var mnemonic = bch.Mnemonic.generate(128)
        var seedBuffer = bch.Mnemonic.toSeed(mnemonic)
        var hdNode = bch.HDNode.fromSeed(seedBuffer)
        var paymentPrivateKey = bch.HDNode.toWIF(hdNode).toString()
        var paymentAddress = bch.HDNode.toCashAddress(hdNode).toString()
        if (paymentAddress.indexOf(':') === -1){
          paymentAddress = 'bitcoincash:' + paymentAddress
        }
        // generate a payment and add it to database
        var sql = 'insert into payments (paymentAddress, paymentKey, merchantID, paymentID) values (?, ?, ?, ?)'
        conn.query(sql, [paymentAddress, paymentPrivateKey, query.merchantID, query.paymentID], (err, result) => {
          if (err) { throw err }
          res.send(paymentAddress)
        })
      }
    })
  }
})

app.get('/api/paymentsent', (req, res) => {
  const query = url.parse(req.url, true).query
  // validate the address
  if (query.address.toString().indexOf(':') === -1) {
    res.send('Invalid address')
  } else {
    try {
      if (bch.Address.isCashAddress(query.address)) {
        // verify txid is of correct length
        if (query.txid.length !== 64) {
          res.send('Invalid TXID')
        } else {
          // verify txid does not already exist in pending table
          var sql = 'select txid from pending where txid = ?'
          conn.query(sql, [query.txid], (err, result) => {
            if (err) { throw err }
            if (result.length !== 0) {
              res.send('TXID is already pending')
            } else {
              // verify txid does not already exist in payments table
              var sql = 'select paymentTXID from payments where paymentTXID = ? or transferTXID = ?'
              conn.query(sql, [query.txid, query.txid], (err, result) => {
                if (err) { throw err }
                if (result.length !== 0) {
                  res.send('TXID already paid')
                } else {
                  // verify the address is in the database
                  var sql = 'select paymentAddress from payments where paymentAddress = ?'
                  conn.query(sql, [query.address], (err, result) => {
                    if (err) { throw err }
                    if (result.length !== 1) {
                      res.send('Address not found')
                    } else {
                      // insert into pending
                      var sql = 'insert into pending (address, txid) values (?, ?)'
                      conn.query(sql, [query.address, query.txid], (err, result) => {
                        if (err) { throw err }
                        res.send('ok')
                      })
                    }
                  })
                }
              })
            }
          })
        }
      }
    } catch (e) {
      res.send('Invalid address')
    }
  }
})

app.get('/api/getmerchantid', (req, res) => {
  if (!req.session.loggedIn) {
    res.send('Please log in first')
  } else {
    res.send(req.session.merchantID)
  }
})

app.get('/api/getusername', (req, res) => {
  if (!req.session.loggedIn) {
    res.send('Please log in first')
  } else {
    res.send(req.session.username)
  }
})

app.post('/api/setusername', (req, res) => {
  const query = url.parse(req.url, true).query
  if (!req.session.loggedIn) {
    res.send('Please log in first')
  } else {
    // verify no other username starts with this username and that this username does not start with any other username
    /*var sql = 'update users set username = ? where payoutAddress = ?'
    conn.query(sql, [query.username, req.session.address], (err, result) => {
      if (err) { throw err }
      res.send('ok')
    })*/
    res.send('not yet implemented')
  }
})

app.get('/api/getpayments', (req, res) => {
  if (!req.session.loggedIn) {
    res.send('Log in first')
  } else {
    var sql = 'select paymentAddress, created, paymentID, paidAmount, paymentTXID, transferTXID from payments where merchantID = ? and transferTXID is not null order by created desc limit 100'
    conn.query(sql, [req.session.merchantID], (err, result) => {
      if (err) { throw err }
      var response = []
      for(var i = 0; i < result.length; i++) {
        response.push(result[i])
      }
      res.send(response)
    })
  }
})

app.get('/api/getunpaidpayments', (req, res) => {
  if(!req.session.loggedIn) {
    res.send('log in first')
  } else {
    var sql = 'select paymentAddress, created, paymentID, paidAmount, paymentTXID, transferTXID from payments where merchantID = ? order by created desc limit 100'
    conn.query(sql, [req.session.merchantID], (err, result) => {
      if (err) { throw err }
      var response = []
      for(var i = 0; i < result.length; i++) {
        response.push(result[i])
      }
      res.send(response)
    })
  }
})

app.get('/api/loggedin', (req, res) => {
	if (req.session.loggedIn) {
		res.send('true')
	} else {
		res.send('false')
	}
})

