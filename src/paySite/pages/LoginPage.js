import React, {Component} from 'react'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import './mainContent.css'

class LoginPage extends Component {

  state = {
    loginError: false
  }

  handleChange = () => {
    let value = document.getElementById('passwordValue').value
    if (value.length < 12) { return }
    var xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://gateway.cash/api/password?password='+encodeURIComponent(value))
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onload = () => {
      if (xhr.status === 200) {
        let response = xhr.responseText.trim()
        console.log('Login response:', response)
        if (response === 'ok') {
          this.props.updateView('createbutton')
        } else {
          setTimeout(() => {this.setState({loginError: true})}, 5000)
        }
      } else {
        console.error('Password check request failed')
      }
    }
    xhr.send('')
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.handleChange()
  }

  handleClick = () => {
    this.props.updateView('forgot')
  }

  render () {
    return (
      <div className="mainContent">
        <h1 className="mainHeading">Enter your password</h1>
        <form onSubmit={this.handleSubmit} noValidate autoComplete="off" >
          <TextField
            style={{
              width:'100%'
            }}
            onChange={this.handleChange}
            id="passwordValue"
            type="password"
            placeholder="password..."
            autoFocus={true}
            helperText={this.state.loginError ? 'Check your password and try again.' : ''}
          />
        </form>
        <br/>
        <br/>
        <Button onClick={this.handleClick}>Forgot password</Button>
      </div>
    )
  }
}

export default LoginPage
