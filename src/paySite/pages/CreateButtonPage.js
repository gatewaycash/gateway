import React, {Component} from 'react'

import './createButtonPage.css'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

class CreateButtonPage extends Component {

  state = {
    merchantID: 'loading',
    paymentID: 'donation',
    buttonText: 'Send a tip',
    dialogTitle: 'Sent a Tip!',
    currency: 'BCH',
    amount: '0.0001'
  }

  constructor (props) {
    super (props)
    // get the merchant ID
    var xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://gateway.cash/api/getmerchantid')
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onload = () => {
      if (xhr.status === 200) {
        let response = xhr.responseText.trim()
        if (response === 'error') {
          alert('Unable to get your merchant ID. Please go back and log in again.')
        } else {
          this.setState({merchantID: response})
        }
      } else {
        console.error('Merchant ID request failed')
      }
    }
    xhr.send('')
  }
	
	componentDidMount () {
		alert('test')
  	const script = document.createElement("script")
    script.src = "https://gateway.cash/pay.js"
    script.async = true
    document.body.appendChild(script)
  }
	
  handleChange = () => {
    this.setState({
      dialogTitle: document.getElementById('dialogTitleField').value,
      buttonText: document.getElementById('buttonTextField').value,
      currency: document.getElementById('currencyField').value,
      amount: document.getElementById('amountField').value,
      paymentID: document.getElementById('paymentIDField').value
    })
  }

  handleViewPayments = () => {
    this.props.updateView('payments')
  }

  handleSettings = () => {
    this.props.updateView('settings')
  }

  render () {
    if (this.state.merchantID === 'loading') {
      return (
        <center>
          <h1>Please wait...</h1>
        </center>
      )
    } else {
      return (
        <div className="container">
          <center>
            <h1>Create a Button</h1>
            <Button
            	variant="contained"
            	color="primary"
            >
            	Create Button
            </Button>
            <Button
              onClick={this.handleViewPayments}
            >
              View Payments
            </Button>
            <Button
              onClick={this.handleSettings}
            >
              Settings
            </Button>
          </center>
          <h2>Customize Your Button</h2>
          <p>
          	Use the settings below to change various aspects of your payment
          	button. Once you're satisfied with the result, scroll down and copy
          	the generated code onto any website where you'd like to accept
          	payments.
          </p>
          <TextField
            style={{
              width:'100%'
            }}
            onChange={this.handleChange}
            id="dialogTitleField"
            label="Dialog Title"
            helperText="The title for the payment dialog box (25 characters max)"
            maxLength={25}
            value={this.state.dialogTitle}
          />
          <br/>
          <br/>
          <TextField
            style={{
              width:'100%'
            }}
            onChange={this.handleChange}
            id="buttonTextField"
            label="Button Text"
            helperText="The text for the payment button (25 characters max)"
            maxLength={25}
            value={this.state.buttonText}
          />
          <br/>
          <br/>
          <TextField
            style={{
              width:'100%'
            }}
            onChange={this.handleChange}
            id="currencyField"
            label="Currency (Not yet implemented, currently always BCH)"
            helperText="Display currency (BCH, USD, EUR...)"
            maxLength={3}
            value={this.state.currency}
          />
          <br/>
          <br/>
          <TextField
            style={{
              width:'100%'
            }}
            onChange={this.handleChange}
            id="amountField"
            label="Amount"
            helperText="Amount (in units of display currency)"
            type="number"
            value={this.state.amount}
          />
          <br/>
          <br/>
          <TextField
            style={{
              width:'100%'
            }}
            onChange={this.handleChange}
            id="paymentIDField"
            label="Payment ID"
            helperText="Unique ID for payments sent to this button (see below)"
            maxLength={32}
            value={this.state.paymentID}
          />
          <br/>
          <br/>
          <h2>Generated Code</h2>
          <p>
          	Add this line of HTML once on each page you want to accept
          	payments:
          </p>
          <pre className="sourceCode">
        		{`<script src="https://gateway.cash/pay.js"></script>`}
      		</pre>
          <p>
          	Add this code wherever you want to place a payment button (it
          	can be in multiple places on the same page as long as each button
            has a unique ID):
          </p>
          <pre className="sourceCode">
          	{`<div
  class="payButton"
  id="pay-unique-id-027354"
  merchantID="` + this.state.merchantID + `"
  paymentID="` + this.state.paymentID + `"
  currency="` + this.state.currency + `"
  amount="` + this.state.amount + `"
  buttonText="` + this.state.buttonText + `"
  dialogTitle="` + this.state.dialogTitle + `"
></div>`}
        	</pre>
          <p>
          	Feel free to change any of the values in the above code block
            except your merchant ID, which is how you'll get paid.
          </p>
          <h2>More Info About Payment IDs</h2>
          <p>
          	The optional Payment ID property can be used to help you keep
            track of different payments made to your merchant account.
            For example, if you're selling T-shirts and you want to know who
            has paid for their order, you can set a payment ID equal to your
            order number. Since payment IDs show up in the View Payments page,
            you'll know which orders have been paid for and are ready to ship.
          </p>
          <h2>A Note on How Payments Are Processed</h2>
          <p>
           	The site generates an addrress for each payment and securely stores
           	the key. The moment the customer pays, the Bitcoin Cash network
           	instantly validates the payment and within 3 seconds, the customer
           	is done and can move on with their day.
          </p>
          <p>
          	New payments are refreshed once every 10 minutes and forwarded to
          	merchants as soon as they are detected. About a tenth of a cent is
          	deducted from each payment to pay for the transfer fee, and if
          	you've chosen to help support the project (off by default), your
          	selected amount will also be deducted as well. All other funds go
          	to your address.
          </p>
          <h2>Support the Project</h2>
          <p>
          	If you like this project and want to see it get even better for both
          	merchants and customers, please consider a donation.
          </p>
          <div
  					className="payButton"
  					id="pay-unique-id-162168"
  					merchantID="ef0fcea08bfa9cb0"
  					paymentID="donation-0.001"
  					currency="BCH"
  					amount="0.001"
  					buttonText="Donate 0.001 BCH"
  					dialogTitle="Make a Donation"
					></div>
					<div
  					className="payButton"
  					id="pay-unique-id-146549"
  					merchantID="ef0fcea08bfa9cb0"
  					paymentID="donation-0.01"
  					currency="BCH"
  					amount="0.01"
  					buttonText="Donate 0.01 BCH"
  					dialogTitle="Make a Donation"
					></div>
					<div
  					className="payButton"
  					id="pay-unique-id-495435"
  					merchantID="ef0fcea08bfa9cb0"
  					paymentID="donation-0.05"
  					currency="BCH"
  					amount="0.05"
  					buttonText="Donate 0.05 BCH"
  					dialogTitle="Make a Donation"
					></div>
					<div
  					className="payButton"
  					id="pay-unique-id-462198"
  					merchantID="ef0fcea08bfa9cb0"
  					paymentID="donation-0.25"
  					currency="BCH"
  					amount="0.25"
  					buttonText="Donate 0.25 BCH"
  					dialogTitle="Make a Donation"
					></div>
					<div
  					className="payButton"
  					id="pay-unique-id-651238"
  					merchantID="ef0fcea08bfa9cb0"
  					paymentID="donation-1"
  					currency="BCH"
  					amount="1"
  					buttonText="Donate 1 BCH"
  					dialogTitle="Make a Donation"
					></div>
        </div>
      )
    }
  }
}

export default CreateButtonPage
