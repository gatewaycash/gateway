import React, { Component } from 'react'
import { navigate } from '@reach/router'
import TextField from '@material-ui/core/TextField'

class RegisterPage extends Component {
  handleSubmit = (event) => {
    event.preventDefault()
    let value = document.getElementById('passwordValue').value
    if (value.length < 12) {
      return
    }
    var xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://gateway.cash/api/register')
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onload = () => {
      if (xhr.status === 200) {
        let response = xhr.responseText.trim()
        console.log('Register response:', response)
        if (response === 'ok') {
          navigate('createbutton')
        } else {
          alert('Error while signing up: ' + response + '\nTry again later.')
        }
      } else {
        console.error('Register request failed')
      }
    }
    xhr.send(encodeURI('password=' + value))
  }

  render() {
    return (
      <div className="mainContent">
        <h1 className="mainHeading">Create a password</h1>
        <form onSubmit={this.handleSubmit} noValidate autoComplete="off">
          <TextField
            style={{
              width: '100%',
            }}
            id="passwordValue"
            type="password"
            placeholder="password..."
            autoFocus={true}
            helperText="It should be at least 12 characters."
          />
        </form>
      </div>
    )
  }
}

export default RegisterPage
