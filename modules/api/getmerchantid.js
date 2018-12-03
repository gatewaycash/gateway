module.exports = function (options) {
  return (req, res) => {
    if (!req.session.loggedIn) {
      res.send('Please log in first')
    } else {
      res.send(req.session.merchantID)
    }
  }
}
