module.exports = function(options) {
  return (req, res) => {
    console.log('/register requested')
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
      // initial checks passed, make sure address is not in the database already
      var sql = 'select payoutAddress from users where payoutAddress = ?'
      conn.query(sql, [req.session.address], (err, result) => {
        if (err) {
          throw err
        }
        if (result.length !== 0) {
          res.send('This address has already been registered')
        } else {
          // no duplicate found, create a new row in the database
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
    }
  }
}
