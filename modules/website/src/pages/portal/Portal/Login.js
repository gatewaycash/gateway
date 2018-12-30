import React from 'react'
import { navigate } from '@reach/router'
import { Paper, Button, TextField } from '@material-ui/core'
import { login } from './../../../API'
import './../../../style/containers.css'

export default () => {
  let [userID, setUserID] = React.useState('')
  let [password, setPassword] = React.useState('')
  let [loginError, setLoginError] = React.useState({})

  // a function for handling the login form submission
  let handleSubmit = async (e) => {

    // prevent the default action of reloading the page
    e.preventDefault()

    // call the API endpoint
    let result = await login(userID, password)
    if (result.status === 'error') {
      setLoginError(result)
    } else {
      setLoginError({})
      sessionStorage.gatewayAPIKey = result.APIKey
      navigate('/portal/dashboard')
    }
  }

  return (
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
        onSubmit={handleSubmit}
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
      <Button onClick={() => navigate('/portal/forgot')}>
        Forgot?
      </Button>
    </center>
    </Paper>
  )
}
