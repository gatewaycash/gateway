import React, { Component } from 'react'
import { setPassword } from 'API'
import { Button, TextField } from '@material-ui/core'
import { Text, Error } from 'components'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

export default class Password extends Component {
  state = {
    newPassword: '',
    confirm: '',
    error: {},
    errorClosed: true
  }

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    setPassword(this.state.newPassword, this.state.confirm).then(response => {
      if (response.status === 'success') {
        this.setState({
          errorClosed: false,
          error: {
            error: 'Success',
            description: 'Your password has been changed'
          }
        })
      } else {
        this.setState({
          error: response,
          errorClosed: false
        })
      }
    })
  }

  render() {
    return (
      <Card className={this.props.className}>
        <CardContent>
          <h2>Account Password</h2>
          <Text>
            Your password protects the security of your account. Never share
            your password with anyone or use the same password across websites.
          </Text>
          <span>
            For your security, your password must follow some guidelines which
            you should also generally use for all your passwords. Your password
            must:
            <ul>
              <li>Be at least 5 characters</li>
              <li>Not be a common word or phrase such as "password"</li>
              <li>Be unique and hard to guess</li>
              <li>Not contain spaces, tabs or other odd characters</li>
            </ul>
          </span>
          <Error
            error={this.state.error}
            closed={this.state.errorClosed}
            setClosed={c => this.setState({ errorClosed: c })}
          />
          <form onSubmit={this.handleSubmit}>
            <TextField
              style={{
                width: '80%'
              }}
              onChange={e =>
                this.setState({
                  newPassword: e.target.value
                })
              }
              label="New Password"
              value={this.state.newPassword}
              type="password"
              autoComplete="new-password"
            />
            <br />
            <br />
            <TextField
              style={{
                width: '80%'
              }}
              onChange={e =>
                this.setState({
                  confirm: e.target.value
                })
              }
              label="Retype Password"
              value={this.state.confirm}
              type="password"
              autoComplete="new-password"
            />
            <br />
            <br />
            <center>
              <Button variant="contained" color="primary" type="submit">
                Change Password
              </Button>
            </center>
          </form>
        </CardContent>
      </Card>
    )
  }
}
