/**
 * Web Services Backend
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Starts and manages the web services backend
 */
const express = require('express')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const bodyParser = require('body-parser')
require('dotenv').config()

// include all endpoint modules
const registerEndpoint = require('./register.js')
const identifyEndpoint = require('./identify.js')
const loginEndpoint = require('./login.js')
const loggedInEndpoint = require('./loggedin.js')
const getPaymentsEndpoint = require('./getpayments.js')
const getUnpaidPaymentsEndpoint = require('./getunpaidpayments.js')
const setUsernameEndpoint = require('./setusername.js')
const getUsernameEndpoint = require('./getusername.js')
const getMerchantIDEndpoint = require('./getmerchantid.js')
const paymentSentEndpoint = require('./paymentsent.js')
const payEndpoint = require('./pay.js')

// include all service daemons
const fundsTransferDaemon = require('./fundsTransfer.js')
const brokenPaymentsDaemon = require('./brokenPayments.js')

// print startup message
console.log('Starting Web Services Backend...')

// create the express instance
const app = express()

// se up bodyParser tor form data handling
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// set up persistant session
app.use(
  session({
    name: 'gateway-session',
    secret: process.env.WEB_SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    store: new FileStore()
  })
)

// enable CORS to allow for API calls from other sites
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET, POST')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, *'
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
app.post('/register', registerEndpoint)
app.get('/identify', identifyEndpoint)
app.get('/login', loginEndpoint)
app.get('/loggedin', loggedInEndpoint)
app.get('/getpayments', getPaymentsEndpoint)
app.get('/getunpaidpayments', getUnpaidPaymentsEndpoint)
app.post('/setusername', setUsernameEndpoint)
app.get('/getusername', getUsernameEndpoint)
app.get('/getmerchantid', getMerchantIDEndpoint)
app.get('/paymentsent', paymentSentEndpoint)
app.get('/pay', payEndpoint)
