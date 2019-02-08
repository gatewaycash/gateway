import React, { Component } from 'react'
import { getContribution } from 'API'
import { Card, CardContent } from '@material-ui/core'

export default class SupportProject extends Component {
  state = {
    totalContributed: 'loading...',
    error: {},
    errorClosed: true
  }

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    getContribution().then(response => {
      if (response.status === 'success') {
        this.setState({
          totalContributed: response.totalContributed
        })
      }
    })
  }

  handleSubmit(e) {
    e.preventDefault()

  }

  render() {
    return (
      <Card className={this.props.className}>
        <CardContent>
          <h2>Supporting the Project</h2>
          <p>
            If you'd like to support the project, you can choose to donate a
            portion of each payment made to your merchant account. This will
            always be off by default, but any support you're able to provide is
            much appreciated.
          </p>
          <p>
            Total Contributions: {this.state.totalContributed / 100000000} BCH
          </p>
        </CardContent>
      </Card>
    )
  }
}
