import React, {Component} from 'react'

import Button from '@material-ui/core/Button'

import './createButtonPage.css'

class PaymentsPage extends Component {

  constructor (props) {
    super(props)
    this.state = {
      payments: 'loading...'
      
    }
    var xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://gateway.cash/api/getpayments')
    xhr.onload = () => {
      if (xhr.readyState === 4) {
        this.setState({payments: xhr.responseText})
      }
    }
    xhr.send()
  }

  handleCreateButton = () => {
    this.props.updateView('createbutton')
  }

  handleSettings = () => {
    this.props.updateView('settings')
  }

  render () {
    return (
      <div className="container">
        <center>
          <h1>Your Payments</h1>
          <Button
            onClick={this.handleCreateButton}
          >
            Create Button
          </Button>
          <Button
            variant="contained"
            color="primary"
          >
            View Payments
          </Button>
          <Button
            onClick={this.handleSettings}
          >
            Settings
          </Button>
          <div id="paymentList">
          <p>{this.state.payments}</p>
          </div>
        </center>
      </div>
    )
  }
}

export default PaymentsPage
