/**
 * /dentify GET endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Provides an endpoint for /identify
 */
const url = require('url')
const mysql = require('mysql')
const bch = require('bitcore-lib-cash')
require('dotenv').config()

module.exports = function (req, res) {
  console.log('/identify requested')
  // parse the request URL
  const query = url.parse(req.url, true).query

  // only allow login by address or username
  if (query.type !== 'address' && query.type !== 'username') {
    res.send('Error: invalid type (must be address or username)')
  } else if (query.type === 'address') {
    // log in by addresss
    // a variable to hold the converted and valid addresss
    var address = false
    // make sure provided address is valid
    try {
      if (
        !bch.Address.isCashAddress(query.value) &&
        !bch.Address.isLegacyAddress(query.value)
      ) {
        // invalid address
        res.send('Error: Invalid address (please use CashAddr or Legacy)')
      } else if (bch.Address.isCashAddress(query.value)) {
        // cash address
        address = query.value
        // check if prefix was given
        if (!address.startsWith('bitcoincash:')) {
          address = 'bitcoincash:' + address
        }
      } else {
        // legacy address
        address = bch.Address.toCashAddress(query.value, true)
      }
    } catch (e) {
      res.send('Invalid address (use CashAddr or Legacy)')
    }
    if (address !== false) {
      // connect to the database
      const conn = mysql.createConnection({
        host: process.env.SQL_DATABASE_HOST,
        user: process.env.SQL_DATABASE_USER,
        password: process.env.SQL_DATABASE_PASSWORD,
        database: process.env.SQL_DATABASE_DB_NAME,
      })

      // start the database connection
      conn.connect((err) => {
        if (err) {
          throw err
        }
        // search the database for the given address
        var sql = 'select payoutAddress from users where payoutAddress = ?'
        conn.query(sql, [address], (err, result) => {
          if (err) {
            throw err
          }
          // save the address to persistant session
          req.session.address = address
          if (result.length !== 1) {
            res.send('register')
          } else {
            res.send('login')
          }
          conn.close()
        })
      })
    }
  } else {
    // log in by username
    if (query.value.length < 10) {
      res.send('No match')
    } else {
      var conn = mysql.createConnection({
        host: process.env.SQL_DATABASE_HOST,
        user: process.env.SQL_DATABASE_USER,
        password: process.env.SQL_DATABASE_PASSWORD,
        database: process.env.SQL_DATABASE_DB_NAME,
      })

      // start the database connection
      conn.connect((err) => {
        if (err) {
          throw err
        }
        var sql = 'select username from users where username = ?'
        conn.query(sql, [query.value], (err, result) => {
          if (err) {
            throw err
          }
          if (result && result.length !== 1) {
            res.send('No match')
          } else {
            req.session.username = query.value
            req.session.save()
            res.send('login')
          }
        })
      })
    }
  }
}
