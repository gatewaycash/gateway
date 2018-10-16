import React, {Component} from 'react'

import Button from '@material-ui/core/Button'

import './createButtonPage.css'

class PaymentsPage extends Component {

  constructor (props) {
    super(props)
    this.state = {
      showUnpaid: false,
      payments: 'loading...'
    }
    var xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://gateway.cash/api/getpayments')
    xhr.onload = () => {
      if (xhr.readyState === 4) {
      	var response = xhr.responseText.toString().trim()
      	this.setState({payments: response})
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
  
  toggleView = () => {
  	var xhr = new XMLHttpRequest()
  	var requestURL = 'https://gateway.cash/api/get'
  	// the boolean is inverted because our goal is to change the state later.
  	if (!this.state.showUnpaid) {
  		requestURL += 'unpaid'
  	}
  	requestURL += 'payments'
    xhr.open('GET', requestURL)
    xhr.onload = () => {
      if (xhr.readyState === 4) {
      	var response = xhr.responseText.toString().trim()
      	this.setState({
      		payments: response,
      		showUnpaid: this.state.showUnpaid ? false : true
      	})
      }
    }
    xhr.send()
  }

	parsePayments = (payments) => {
		if (this.state.payments === 'loading...') {
			return 'loading...'
		} else {
			try {
				payments = JSON.parse(payments)
				var returnValue = ''
				for (var i = 0; i < payments.length; i++) {
					returnValue += `<div class="payment">`
					returnValue += '<p>Created: ' + payments[i].created + '</p>'
					returnValue += '<p>Payment ID: ' + payments[i].paymentID + '</p>'
					returnValue += '<p>Address: ' + payments[i].paymentAddress + '</p>'
					returnValue += '<p>TXID: ' + payments[i].paymentTXID + '</p>'
					returnValue += '<p>Amount: ' + payments[i].paidAmount + '</p>'
					returnValue += '<p>Transfer TXID: ' + payments[i].transferTXID + '</p>'
					returnValue += `</div>`
				}
				return returnValue
			}catch (e) {
				return 'loading...'
			}
		}
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
        </center>
        <h2>Payments</h2>
        <p>
        	Below is a list of payments amde to your merchant account. They are
        	sorted by date, the most recent payments appearing at the top.
        </p>
        <div dangerouslySetInnerHTML={{__html: this.parsePayments(this.state.payments)}}>
        </div>
        <h2>About Unpaid and Unprocessed Payments</h2>
        <p>
        	Unpaid and unprocessed payments usually occur when a customer clicks
        	on a payment button but then closes it without making a payment.
        	Pending payments (payments that haven't yet been processed) will also
        	fall into this category.
        </p>
        <center>
        <Button
        	variant="contained"
        	color="primary"
        	onClick={this.toggleView}
        >
        	{
        		this.state.showUnpaid ?
        		'Show Only Processed Payments' :
        		'Include all Unpaid Payments'
        	}
        </Button>
        </center>
      </div>
    )
  }
}

export default PaymentsPage
