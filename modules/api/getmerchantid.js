module.exports = function (req, res) {
  if (!req.session.loggedIn) {
    res.send('Please log in first')
  } else {
    res.send(req.session.merchantID)
  }
}
