/**
 * /register POST endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a POST endpoint for /register
 */
const mysql = require('mysql')

module.exports = function (req, res) {
  console.log('/register requested')
  // check some basic things for validity
  if (!req.session.address || req.session.address.length < 20) {
    res.send('Make sure to give an address before trying to register')
  } else if (!bch.Address.isCashAddress(req.session.address)) {
    res.send('Make sure the provided addres is a valid CashAddress!')
  } else if (!req.body.password) {
    res.send('Please provide a password')
  } else if (req.body.password.length < 12) {
    res.send('Password must be at least 12 characters')
  } else if (req.body.password.toString().indexOf(' ') !== -1) {
    res.send('No spaces are allowed in your password')
  } else {
    // connect to the database
    const conn = mysql.createConnection({
      host: process.env.SQL_DATABASE_HOST,
      user: process.env.SQL_DATABASE_USER,
      password: process.env.SQL_DATABASE_PASSWORD,
      database: process.env.SQL_DATABASE_DB_NAME,
    })
    conn.connect((err, res) => {
      if (err) {
        throw err
      }
      // make sure address is not in the database already
      var sql = `select payoutAddress
        from users
        where
        payoutAddress = ?`
      conn.query(sql, [req.session.address], (err, result) => {
        if (err) {
          throw err
        }
        if (result.length !== 0) {
          res.send('This address has already been registered')
        } else {

          // create the new user account
          var merchantID = sha256(req.session.address).substr(0, 16)
          var passwordSalt = sha256(require('crypto').randomBytes(32))
          var passwordHash = sha256(req.body.password + passwordSalt)
          var sql = `insert into users
            (payoutAddress, merchantID, password, salt)
            values
            (?, ?, ?, ?)`
          conn.query(
            sql,
            [req.session.address, merchantID, passwordHash, passwordSalt],
            (err, result) => {
              if (err) {
                throw err
              }
              // registration complete, set up session and print OK message
              req.session.merchantID = merchantID
              req.session.username = ''
              req.session.loggedIn = true
              res.send('ok')
            },
          )
        }
      })
    })
  }
}
