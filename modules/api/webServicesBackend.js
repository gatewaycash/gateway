/**
 * Web Services Backend
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Starts and manages the web services backend
 */
const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()

// include all endpoint modules
const registerEndpoint = require('./endpoints/POST/register')
const loginEndpoint = require('./endpoints/GET/login')
const getPaymentsEndpoint = require('./endpoints/GET/payments')
const setUsernameEndpoint = require('./endpoints/POST/username')
const getUsernameEndpoint = require('./endpoints/GET/username')
const getMerchantIDEndpoint = require('./endpoints/GET/merchantid')
const paidEndpoint = require('./endpoints/POST/paid')
const payEndpoint = require('./endpoints/POST/pay')
const newAPIKeyEndpoint = require('./endpoints/GET/newapikey')
const totalSalesEndpoint = require('./endpoints/GET/totalsales')
const getAddressEndpoint = require('./endpoints/GET/address')

// include all service daemons
const fundsTransferService = require('./services/fundsTransfer')
const brokenPaymentsService = require('./services/brokenPayments')

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

// utilize the API endpoints for appropriate requests
// POST requests
app.post('/register', registerEndpoint)
app.post('/paid', paidEndpoint)
app.post('/pay', payEndpoint)
app.post('/username', setUsernameEndpoint)
// GET requests
app.get('/login', loginEndpoint)
app.get('/payments', getPaymentsEndpoint)
app.get('/username', getUsernameEndpoint)
app.get('/merchantid', getMerchantIDEndpoint)
app.get('/newapikey', newAPIKeyEndpoint)
app.get('/totalsales', totalSalesEndpoint)
app.get('/address', getAddressEndpoint)

// start the payment processing services

// run the main processor every 30 seconds
setInterval(fundsTransferService.run, 30000)

// run the broken payments processor every 12 hours
setInterval(brokenPaymentsService.run, 43200000)
