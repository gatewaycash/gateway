module.exports = function (options) {
  return (req, res) => {
    if (!req.session.loggedIn) {
      res.send('Please log in first')
    } else {
      var sql = 'select username from users where merchantID = ?'
      conn.query(sql, [req.session.merchantID], (err, result) => {
        res.send(result[0].username)
      })
    }
  }
}
