import React, { Component } from 'react'
import { newapikey } from 'API'
import { Button } from '@material-ui/core'
import { Container, Text, SourceCode } from 'components'

export default class APIInfo extends Component {

  state = {
    APIKey: sessionStorage.gatewayAPIKey,
    showKey: false
  }

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    newapikey().then((response) => {
      if (response.status === 'success') {
        this.setState({
          APIKey: response.newAPIKey
        })
        sessionStorage.gatewayAPIKey = response.newAPIKey
      }
    })
  }

  render() {
    return (
      <Container>
        <h2>Gateway API Access</h2>
        <Text>
          Your merchant account comes with free access to the Gateway API! That means you can build custom services and solutions that fit your needs without running your own servers.
        </Text>
        <h3>Your API Key</h3>
        <Text>
          Your account's API key is being used behind the scenes whenever you use gateway.cash. To learn more about the Gateway API, go
          <a href="https://api.gateway.cash">here</a>.
        </Text>
        {
          this.state.showKey ? (
            <>
              <SourceCode>
                {this.state.APIKey}
              </SourceCode>
              <h3>Generate New Key</h3>
              <Text>
                Generating a new API key will invalidate your current key and
                will log out any devices and services which use your merchant
                account.
              </Text>
              <form onSubmit={this.handleSubmit}>
                <center>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    New API Key
                  </Button>
                </center>
              </form>
            </>
          ) : (
            <center>
              <Button
                color="primary"
                onClick={() => this.setState({showKey: true})}
              >
                Show Key
              </Button>
            </center>
          )
        }
      </Container>
    )
  }
}
