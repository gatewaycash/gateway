import React from 'react'
import { navigate } from '@reach/router'
import { Button, TextField, Card, CardContent } from '@material-ui/core'
import { login } from 'API'
import { Error } from 'components'

export default ({ className }) => {
  let [userID, setUserID] = React.useState('')
  let [password, setPassword] = React.useState('')
  let [loginError, setLoginError] = React.useState({})
  let [errorClosed, setErrorClosed] = React.useState(true)

  // a function for handling the login form submission
  let handleSubmit = async e => {
    // prevent the default action of reloading the page
    e.preventDefault()

    // call the API endpoint
    let result = await login(userID, password)
    if (result.status === 'error') {
      setLoginError(result)
      setErrorClosed(false)
    } else {
      setLoginError({})
      setErrorClosed(true)
      sessionStorage.gatewayAPIKey = result.APIKey
      navigate('/portal/dashboard')
    }
  }

  return (
    <Card className={className}>
      <CardContent>
        <h1>Log In</h1>
        <p>
          If you have a Gateway account, log in below using your Gateway.cash
          username:
        </p>
        <Error
          error={loginError}
          closed={errorClosed}
          setClosed={setErrorClosed}
        />
        <center>
          <form onSubmit={handleSubmit}>
            <TextField
              value={userID}
              onChange={e => setUserID(e.target.value)}
              placeholder="Username"
              style={{
                width: '80%'
              }}
            />
            <br />
            <br />
            <TextField
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              style={{
                width: '80%'
              }}
            />
            <br />
            <br />
            <Button variant="contained" color="primary" type="submit">
              log in
            </Button>
          </form>
        </center>
        <br />
        <p>
          If you are trying to log into an account that didn't previously have
          a username (you only ever used your BCH address), your username has
          been set to the <b>first 20 characters of your address</b>. Please
          go to Settings once you've logged in and change your username.
        </p>
        <p>
          If you have forgotten your Gateway.cash username and your merchant
          account's payout address or if you can't remember your password, send
          an email to passwordreset@gateway.cash and we will attempt to help
          you.
        </p>
      </CardContent>
    </Card>
  )
}
