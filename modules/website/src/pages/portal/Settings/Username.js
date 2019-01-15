import React, { Component } from 'react'
import { getUsername, setUsername } from 'API'
import { Button, TextField } from '@material-ui/core'
import { Container, Text, Error } from 'components'

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
    getUsername().then((response) => {
      if (response.status === 'success') {
        this.setState({
          username: response.username,
          newUsername: response.username
        })
      }
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    setUsername(this.state.newUsername).then((response) => {
      if (response.status === 'success') {
        this.setState({
          username: response.username,
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
      <Container>
        <h2>{this.state.username.toUpperCase()}</h2>
        <Text>
          Your username can be used as a more convenient way to log into
          gateway.cash instead of typing your address every time.
        </Text>
        <Text>
          When you reserve your username, there are some restrictions which
          allow for an easier login experience for all merchants.
        </Text>
        <Text>
          Your username must:
          <ul>
            <li>Be between 5 and 24 characters long</li>
            <li>
              Not contain special characters such as {'({[<\'"\\,!@#|$%^./"\'>]})'}
            </li>
            <li>Not contain spaces, tabs or other odd characters</li>
          </ul>
        </Text>
        <Error
          error={this.state.error}
          closed={this.state.errorClosed}
          setClosed={c => this.setState({errorClosed: c})}
        />
        <form onSubmit={this.handleSubmit}>
          <TextField
            style={{
              width: '80%',
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
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              Update Your Username
            </Button>
          </center>
        </form>
      </Container>
    )
  }
}
