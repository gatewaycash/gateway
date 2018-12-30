import React from 'react'
import NavigationMenu from './NavigationMenu'
import { navigate } from '@reach/router'
import { Button, Paper, TextField } from '@material-ui/core'
import { login } from './../../API'
import Footer from './../../components/Footer'

export default () => {
  let [userID, setUserID] = React.useState('')
  let [password, setPassword] = React.useState('')
  let [loginError, setLoginError] = React.useState({})
  return (
    <>
      {sessionStorage.gatewayAPIKey && <NavigationMenu page="Dashboard" />}
      <Paper className="paper container">
        <center>
          <h1>Log In</h1>
          <p>
            If you have a Gateway account, log in below with your address or username and your password:
          </p>
          {
            loginError.error &&
            <div
              style={{
                color: 'darkred',
                textAlign: 'left',
                border: '0.2em solid darkred',
                borderRadius: '0.5em',
                backgroundColor: '#ffdddd',
                margin: '0.5em',
                padding: '0.5em'
              }}
            >
              <h4>{loginError.error}</h4>
              <p>{loginError.description}</p>
            </div>
          }
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              let result = await login(userID, password)
              console.log(result)
              if (result.status === 'error') {
                setLoginError(result)
              } else {
                setLoginError({})
              }
            }}
          >
          <TextField
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            placeholder="Address or username"
          />
          <br/>
          <br/>
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
          />
          <br/>
          <br/>
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            log in
          </Button>
          </form>
          <br />
          <br />
          <Button onClick={() => navigate('/portal/forgot')}>
            Forgot?
          </Button>
        </center>
      </Paper>
      <Paper className="paper container">
        <h1>Register</h1>
      </Paper>
      <Footer />
    </>
  )
}
