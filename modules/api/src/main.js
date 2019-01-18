/**
 * Web Services Backend
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Starts and manages the web services backend
 */
import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
dotenv.config()

import * as GETEndpoints from 'endpoints/GET'
import * as POSTEndpoints from 'endpoints/POST'

// include all service daemons
//const fundsTransferService = require('./services/fundsTransfer')
//const brokenPaymentsService = require('./services/brokenPayments')

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
Object.keys(GETEndpoints).forEach((e) => {
  app.get('/' + e, GETEndpoints[e])
})
Object.keys(POSTEndpoints).forEach((e) => {
  app.post('/' + e, POSTEndpoints[e])
})

// start the payment processing services
// run the main processor every 30 seconds
//setInterval(fundsTransferService.run, 30000)

// run the broken payments processor every 12 hours
//setInterval(brokenPaymentsService.run, 43200000)
