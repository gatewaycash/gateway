/**
 * Web Services Backend
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Starts and manages the web services backend
 */
import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import {
  fundsTransferService,
  brokenPaymentsService,
  exchangeRatesService
} from 'services'
import tests from 'tests'
import routes from 'routes'
import prettyjson from 'prettyjson'
dotenv.config()

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// enable CORS to allow for API calls from other sites
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

// consolidate form and request data into one place
app.use((req, res, next) => {
  req.body = { ...req.body, ...req.params, ...req.query }
  next()
})

// log each request to the console, without logging passwords
app.use((req, res, next) => {
  console.log('[' + req.method + '] ' + req._parsedUrl.pathname)
  if (req.body.password || req.body.newPassword) {
    let logObject = JSON.parse(JSON.stringify(req.body))
    if (logObject.newPassword) logObject.newPassword = '********'
    if (logObject.password) logObject.password = '********'
    console.log(prettyjson.render(logObject, { keysColor: 'blue' }))
  } else {
    console.log(prettyjson.render(req.body, { keysColor: 'blue' }))
  }
  next()
})

// serve the public directory's static resources
// (API docs landing page)
app.use(express.static('public'))

// utilize the API endpoints for appropriate requests
routes(app)

// listen for connections
app.listen(process.env.WEB_PORT, () => {
  console.log('Gateway API listening on port', process.env.WEB_PORT)
})

// start the payment processing services if we are not in test mode
if (!process.env.TEST_MODE) {
  // run the main processor every 30 seconds
  setInterval(fundsTransferService, 30000)
  // run the exchange rates service every 10 minutes
  setInterval(exchangeRatesService, 600000)
  // run the broken payments processor every 12 hours
  setInterval(brokenPaymentsService, 43200000)

  // run tests if we are in test mode
} else {
  tests()
}
