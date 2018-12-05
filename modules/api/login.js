const url = require('url')
module.exports = function (req, res) {
    console.log('/login requested')
    // parse the provided data
    const query = url.parse(req.url, true).query
    if (!req.session.address && !req.session.username) {
      res.send('Provide an address or username first')
    } else if (query.password.length < 12) {
      res.send('Incorrect password')
    } else if (req.session.address) {
      // prefer logging in by address
      var sql = 'select * from users where payoutAddress = ?'
      conn.query(sql, [req.session.address], (err, result) => {
        if (err) {
          throw err
        }
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
    } else {
      // search by username
      console.log(req.session)
      var sql = 'select * from users where username = ?'
      conn.query(sql, [req.session.username], (err, result) => {
        if (err) {
          throw err
        }
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
}
