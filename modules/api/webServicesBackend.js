/**
 * Web Services Backend
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Starts and manages the web services backend
 */
const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()

// include all endpoint modules
const registerEndpoint = require('./endpoints/register.js')
const loginEndpoint = require('./endpoints/login.js')
const getPaymentsEndpoint = require('./endpoints/getpayments.js')
const getUnpaidEndpoint = require('./endpoints/getunpaid.js')
const setUsernameEndpoint = require('./endpoints/setusername.js')
const getUsernameEndpoint = require('./endpoints/getusername.js')
const getMerchantIDEndpoint = require('./endpoints/getmerchantid.js')
const paidEndpoint = require('./endpoints/paid.js')
const payEndpoint = require('./endpoints/pay.js')
const newAPIKeyEndpoint = require('./endpoints/newapikey.js')

// include all service daemons
const fundsTransferDaemon = require('./daemons/fundsTransfer.js')
const brokenPaymentsDaemon = require('./daemons/brokenPayments.js')

// print startup message
console.log('Starting Web Services Backend...')

// create the express instance
const app = express()

// se up bodyParser tor form data handling
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// enable CORS to allow for API calls from other sites
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

// serve the public directory's static resources
// (API docs landing page)
app.use(express.static('public'))

// listen for connections
app.listen(process.env.WEB_PORT, () => {
  console.log('Web services API listening on port', process.env.WEB_PORT)
})

// start the payment processing daemons
// assign to variables to prevent garbage collection
// TODO make this work
//var ftd = new fundsTransferDaemon()
//var bpd = new brokenPaymentsDaemon()

// finally, utilize API endpoints for appropriate requests
// POST requests
app.post('/register', registerEndpoint)
app.post('/paid', paidEndpoint)
app.post('/pay', payEndpoint)
app.post('/setusername', setUsernameEndpoint)
// GET requests
app.get('/login', loginEndpoint)
app.get('/getpayments', getPaymentsEndpoint)
app.get('/getunpaid', getUnpaidEndpoint)
app.get('/getusername', getUsernameEndpoint)
app.get('/getmerchantid', getMerchantIDEndpoint)
app.get('/newapikey', newAPIKeyEndpoint)
