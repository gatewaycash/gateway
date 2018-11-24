/**
 * Web Services Backend
 * @author Ty Everett <ty@tyweb.us>
 * @file Starts the backend web services
 */

const express = require('express')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const bodyParser = require('body-parser')
const mysql = require('mysql')

const registerEndpoint = require('./register.js')

// define a class to export
class webServerBackend {
  constructor() {
    // define the app
    const app = express()

    // se up bodyParser tor form data handling
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    // set up persistant session
    app.use(
      session({
        name: 'gateway-session',
        secret: 'sajdfpaioewypjmpasodjw,adfjwoiejfo',
        saveUninitialized: true,
        resave: true,
        store: new FileStore(),
      }),
    )

    // enable CORS to allow for API calls from other sites
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
      )
      next()
    })

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
      database: 'gateway',
    })
    conn.connect((err) => {
      if (err) {
        throw err
      }
    })

    // include the other API endpoints
    app.post('/api/register', registerEndpoint)
  }
}

export default webServerBackend
