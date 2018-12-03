module.exports = function (options) {
  return (req, res) => {
    if (req.session.loggedIn) {
      res.send('true')
    } else {
      res.send('false')
    }
  }
}
