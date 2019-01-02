import React, { Component } from 'react'
import { Button, TextField } from '@material-ui/core'
import { Container, Footer, Text } from 'components'
import NavigationMenu from './NavigationMenu'
import { getUsername } from 'API'

class SettingsPage extends Component {
  state = {
    username: 'loading...',
    newUsername: ''
  }

  constructor(props) {
    super(props)
    getUsername().then((response) => {
      if (response.status === 'success') {
        this.setState({
          username: response.username,
          newUsername: response.username
        })
      }
    })
    this.updateUsername.bind(this)
  }

  updateUsername = (e) => {
    alert('Not Yet Impoemented (use api.gateway.cash for now)')
  }

  render() {
    return (
      <>
      <NavigationMenu page="Your Account" />
        <Container>
          <h2>Display Currency</h2>
          <Text>
            Bitcoin Cash (BCH) units will always be displayed. In places like
            the View Payments page, you can choose to have values converted
            and displayed in other currencies as well. When viewing payments,
            you will be shown the current value as well as what the value was
            at the time the payment was made.
          </Text>
          <p>This feature hasn't been built yet, please check back soon.</p>
        </Container>
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
          <p>This feature hasn't been built yet, please check back soon.</p>
          <TextField
            style={{
              width: '100%',
            }}
            onChange={(e) => {
              this.setState({
                newUsername: e.target.value.toLowerCase().substr(0, 24)
              })
            }}
            label="New Username"
            value={this.state.newUsername}
          />
          <br />
          <br />
          <center>
            <Button
              variant="contained"
              color="primary"
              onClick={this.updateUsername}
            >
              Update Your Username
            </Button>
          </center>
        </Container>
        <Container>
          <h2>Supporting the Project</h2>
          <Text>
            If you'd like to support the project, you can choose to donate a
            portion of each payment made to your merchant account. This will
            always be off by default, but any support you're able to provide is
            much appreciated.
          </Text>
          <p>This feature hasn't been built yet, please check back soon.</p>
        </Container>
        <Footer />
      </>
    )
  }
}

export default SettingsPage
