import React, { Component } from 'react'
import { getUsername, setUsername } from 'API'
import { Button, TextField } from '@material-ui/core'
import { Error } from 'components'
import { Card, CardContent } from '@material-ui/core'

export default class Username extends Component {
  state = {
    username: 'loading...',
    newUsername: 'loading...',
    error: {},
    errorClosed: true
  }

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    getUsername().then(response => {
      if (response.status === 'success') {
        this.setState({
          username: response.username,
          newUsername: response.username
        })
      }
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    setUsername(this.state.newUsername).then(response => {
      if (response.status === 'success') {
        this.setState({
          username: response.newUsername,
          newUsername: response.newUsername,
          errorClosed: false,
          error: {
            error: 'Success',
            description: 'Your username has been updated'
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
          <h2>{this.state.username.toUpperCase()}</h2>
          <p>
            Your username can be used as a more convenient way to log into
            gateway.cash instead of typing your address every time.
          </p>
          <p>
            When you reserve your username, there are some restrictions which
            allow for an easier login experience for all merchants.
          </p>
          <span>
            Your username must:
            <ul>
              <li>Be between 5 and 24 characters long</li>
              <li>
                Not contain special characters such as{' '}
                {'({[<\'"\\,!@#|$%^./"\'>]})'}
              </li>
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
                  newUsername: e.target.value.toLowerCase().substr(0, 24)
                })
              }
              label="New Username"
              value={this.state.newUsername}
            />
            <br />
            <br />
            <center>
              <Button variant="contained" color="primary" type="submit">
                Update Your Username
              </Button>
            </center>
          </form>
        </CardContent>
      </Card>
    )
  }
}
