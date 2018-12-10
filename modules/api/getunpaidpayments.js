module.exports = function (options) {
  return (req, res) => {
    if (!req.session.loggedIn) {
      res.send('log in first')
    } else {
      var sql =
        'select paymentAddress, created, paymentID, paidAmount, paymentTXID, transferTXID from payments where merchantID = ? order by created desc limit 100'
      conn.query(sql, [req.session.merchantID], (err, result) => {
        if (err) {
          throw err
        }
        var response = []
        for (var i = 0; i < result.length; i++) {
          response.push(result[i])
        }
        res.send(response)
      })
    }
  }
}
