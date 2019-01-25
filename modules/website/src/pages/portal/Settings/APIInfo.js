import React, { Component } from 'react'
import { getapikeys } from 'API'
import { Button } from '@material-ui/core'
import { Container, Text, SourceCode } from 'components'

export default class APIInfo extends Component {

  state = {
    APIKeys: [],
    showKeys: false
  }

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    getapikeys().then((response) => {
      if (response.status === 'success') {
        this.setState({
          APIKeys: response.APIKeys
        })
      }
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    // ...
  }

  render() {
    return (
      <Container>
        <h2>Gateway API Access</h2>
        <Text>
          Your merchant account comes with free access to the Gateway API! That
          means you can build custom services and solutions that fit your needs
          without running your own servers.
        </Text>
        <h3>Your API Keys</h3>
        <Text>
          Your account needs to have at least one API key to operate. If all
          your keys get deleted, a new one is generated for you automatically
          at login. To learn more about the Gateway API,
          go <a href="https://api.gateway.cash">here</a>.
        </Text>
        <Text>
          Don't share your API keys with anyone else. With these keys, someone could change your password, steal your funds and hijack your account!
        </Text>
        {
          this.state.showKey ? (
            <>
              <SourceCode>
                {this.state.APIKeys.toString()}
              </SourceCode>
              <h3>Generate New Key (not working yet)</h3>
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
                onClick={() => this.setState({showKeys: true})}
              >
                Show API Keys
              </Button>
            </center>
          )
        }
      </Container>
    )
  }
}
