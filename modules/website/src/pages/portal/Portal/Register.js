import React from 'react'
import { navigate } from '@reach/router'
import { Paper, Button, TextField } from '@material-ui/core'
import { register } from './../../../API'
import './../../../style/containers.css'

export default () => {
  let [address, setAddress] = React.useState('')
  let [username, setUsername] = React.useState('')
  let [password, setPassword] = React.useState('')
  let [passwordConfirm, setPasswordConfirm] = React.useState('')
  let [registerError, setRegisterError] = React.useState({})

  // a function for handling the form submission
  let handleSubmit = async (e) => {

    // prevent the default action of reloading the page
    e.preventDefault()

    // call the API endpoint
    let result = await register(address, username, password, passwordConfirm)
    if (result.status === 'error') {
      setRegisterError(result)
    } else {
      setRegisterError({})
      sessionStorage.gatewayAPIKey = result.APIKey
      navigate('/portal/dashboard')
    }
  }

  return (
    <Paper className="paper container">
    <center>
      <h1>Register for Free</h1>
      <p>
        Sign up for a Gateway merchant account to instantly start creating
        payment buttons and tracking invoices across your websites and apps.
        All you need is a Bitcoin Cash address, a username and a password:
      </p>
      {
        registerError.error &&
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
          <h4>{registerError.error}</h4>
          <p>{registerError.description}</p>
        </div>
      }
      <form
        onSubmit={handleSubmit}
      >
      <TextField
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Bitcoin Cash address"
      />
      <br/>
      <br/>
      <TextField
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Your new ussrname"
      />
      <br />
      <br />
      <TextField
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
      />
      <br />
      <br />
      <TextField
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        placeholder="Retype password"
        type="password"
      />fffff
      <br />
      <br />
      <Button
        variant="contained"
        color="primary"
        type="submit"
      >
        Register
      </Button>
      </form>
      <br />
      <Button>Advanced</Button>
      <br />
    </center>
    <h3>Wondering how to get an address?</h3>
    <p>
      In order to start accepting Bitcoin Cash, you must first create a
      Bitcoin Cash wallet. We recommend using
      the <a href="https://wallet.bitcoin.com" target="_blank"
      rel="noopener noreferrer">bitcoin.com wallet</a>, a tried-and-true wallet
      trusted by the community.
    </p>
    </Paper>
  )
}
