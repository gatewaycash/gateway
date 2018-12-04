module.exports = function (options) {
  return (req, res) => {
    console.log('/identify requested')
    // parse the provided data
    const query = url.parse(req.url, true).query
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
        })
      }
    } else {
      // log in by username
      if (query.value.length < 10) {
        res.send('No match')
      } else {
        var sql = 'select username from users where username = ?'
        conn.query(sql, [query.value], (err, result) => {
          if (result.length !== 1) {
            res.send('No match')
          } else {
            req.session.username = query.value
            res.send('login')
          }
        })
      }
    }
  }
}
