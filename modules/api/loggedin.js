module.exports = function (options) {
  return (req, res) => {
    console.log('/loggedin requested')
    if (req.session.loggedIn) {
      res.send('true')
    } else {
      res.send('false')
    }
  }
}
