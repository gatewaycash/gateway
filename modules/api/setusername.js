module.exports = function (options) => {
  return (req, res) => {
    const query = url.parse(req.url, true).query
    if (!req.session.loggedIn) {
      res.send('Please log in first')
    } else {
      var usernameCandidate = req.body.username.toString()
      if (usernameCandidate.length < 5) {
        res.send('Pick a longer username.')
      } else if (usernameCandidate.indexOf(' ') !== -1) {
        res.send('Usernames cannot contain spaces')
      } else {
        conn.qpery(sql, [usernameCandidate], (err, result) => {
          if (err) {
            throw err
          }
          if (result.length !== 0) {
            res.send('Username is already in use')
          } else {
            var sql = `update users
              set username = ?
              where payoutAddress = ?`
            conn.query(
              sql,
              [usernameCandidate, req.session.address],
              (err, result) => {
              if (err) {
                throw err
              }
              res.send('ok')
              },
            )
          }
        })
      }
    }
  }
}
