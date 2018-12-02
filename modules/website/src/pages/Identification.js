import React, { Component } from 'react'
import { navigate } from '@reach/router'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import bchaddr from 'bchaddrjs'

class IdentificationPage extends Component {
  state = {
    value: '',
    username: false,
    loginError: false,
  }

  handleChange = () => {
    let value = document.getElementById('loginValue').value
    if (this.state.username === false) {
      // check for a valid Bitcoin Cash address and convert if needed
      let valid = false
      try {
        let isCash = bchaddr.isCashAddress(value.trim())
        let isLegacy = bchaddr.isLegacyAddress(value.trim())
        if (isLegacy) {
          value = bchaddr.toCashAddress(value)
          isCash = true
        }
        valid = isCash
        if (value.indexOf(':') === -1) {
          value = 'bitcoincash:' + value
        }
      } catch (e) {}
      if (valid) {
        this.submitData('address', value.trim())
      }
    } else {
      // ask the server about usernames longer than 10 characters long
      if (value.trim().length > 10) {
        this.submitData('username', value.trim())
      }
    }
  }

  toggleUsername = () => {
    this.setState({ username: this.state.username ? false : true })
  }

  submitData(type, value) {
    let xhr = new XMLHttpRequest()
    xhr.open(
      'GET',
      process.env.REACT_APP_GATEWAY_BACKEND + '/login?type=' +
        type +
        '&value=' +
        encodeURIComponent(value),
    )
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onload = () => {
      if (xhr.status === 200) {
        let response = xhr.responseText.trim()
        console.log('Username check response:', response)
        if (response === 'login') {
          navigate('/login')
        } else if (response === 'register') {
          navigate('/register')
        } else {
          setTimeout(() => {
            this.setState({ loginError: true })
          }, 5000)
        }
      } else {
        console.error('Username check request failed', xhr)
      }
    }
    xhr.send()
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.handleChange()
  }

  render() {
    return (
      <div className="mainContent">
        <h1 className="mainHeading">
          Enter your{' '}
          {this.state.username
            ? 'gateway.cash username'
            : 'Bitcoin Cash address'}
        </h1>
        <form onSubmit={this.handleSubmit} noValidate autoComplete="off">
          <TextField
            onChange={this.handleChange}
            style={{
              width: '100%',
            }}
            id="loginValue"
            placeholder={this.state.username ? 'username' : 'bitcoincash:q...'}
            autoFocus={true}
            helperText={
              this.state.loginError
                ? 'Check your username or use your address instead'
                : ''
            }
          />
          <br />
          <br />
          <Button onClick={this.toggleUsername}>
            I have a{' '}
            {this.state.username
              ? 'Bitcoin Cash address'
              : ' gateway.cash username'}
          </Button>
        </form>
      </div>
    )
  }
}

export default IdentificationPage
