import React, {Component} from 'react'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import menu from '@material-ui/core/Menu'

import './../MainContent.css'
import './CreateButtonPage.css'

import NavigationMenu from './../NavigationMenu.js'
import PayButton from './../../payButton/PayButton.js'

class CreateButtonPage extends Component {

  state = {
    merchantID: 'loading',
    paymentID: 'donation',
    buttonText: 'Donate',
    dialogTitle: 'Make a Donation',
    currency: 'BCH',
    amount: '0',
    advanced: false
  }

  constructor (props) {
    super (props)
    
    // get the merchant ID
    let xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://gateway.cash/api/getmerchantid')
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onload = () => {
      if (xhr.readyState === 4) {
        let response = xhr.responseText.toString().trim()
        if (response.length === 16 && response.indexOf(' ') === -1) {
        	this.setState({merchantID: response})
        } else {
        	alert('Error: \n\n' + response)
        }
      }
    }
    xhr.send()
  }
	
	toggleAdvanced = () => {
		this.setState({advanced: this.state.advanced ? false : true})
	}
	
  handleChange = () => {
    this.setState({
      buttonText: document.getElementById('buttonTextField').value,
      amount: document.getElementById('amountField').value,
      currency: document.getElementById('currencyField').value
    })
    if (this.state.advanced) {
      this.setState({
        dialogTitle: document.getElementById('dialogTitleField').value,
        paymentID: document.getElementById('paymentIDField').value
      })
    }
  }

	renderCreationForm = () => {
		return (
			<div className="creationForm">
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
          id="buttonTextField"
          label="Button Text"
          helperText="Give your payment button a label"
          maxLength={25}
          value={this.state.buttonText}
        />
        <TextField
          style={{
            width:'66%',
            float:'left',
          }}
          onChange={this.handleChange}
          id="amountField"
          label="Amount"
          helperText="Amount in units of display currency. -1 for any amount"
          type="number"
          value={this.state.amount}
        />
        <TextField
          style={{
            width:'33%',
            float:'right',
          }}
          onChange={this.handleChange}
          id="currencyField"
          label="Currency"
          helperText="BCH, USD, EUR..."
          maxLength={3}
          value={this.state.currency}
        />
        {this.renderAdvancedOptions()}
    	</div>
		)
	}
	
	renderAdvancedOptions = () => {
		return this.state.advanced ? (
    	<div>
    		<TextField
          style={{
            width:'100%'
	        }}
  	      onChange={this.handleChange}
  	      id="dialogTitleField"
  	      label="Dialog Title"
  	      helperText="Title for payment dialog box"
          maxLength={25}
          value={this.state.dialogTitle}
	       />
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
  	  </div>
    ) : (
      <div>
        <center>
    	    <Button
            color="primary"
            onClick={this.toggleAdvanced}
          >
      	    Advanced Options
     	    </Button>
     	  </center>
     	</div>
    )
	}
	
	renderGeneratedCode = () => {
    var buttonCode = '<div\n  class="payButton"\n'
    buttonCode += '  id="pay-' + Math.floor(Math.random() * 100000) + '"\n'
    buttonCode += '  merchantID="' + this.state.merchantID + '"\n'
    if (this.state.buttonText.toString().toLowerCase() !== 'donate') {
      buttonCode += '  buttonText="' + this.state.buttonText + '"\n'
    }
    if (this.state.amount !== '0') {
      buttonCode += '  amount="' + this.state.amount + '"\n'
    }
    if (this.state.currency.toString().toLowerCase() !== 'bch') {
      buttonCode += '  currency="' + this.state.currency + '"\n'
    }
    if (this.state.dialogTitle.toString().toLowerCase() !== 'make a donation') {
      buttonCode += '  dialogTitle="' + this.state.dialogTitle + '"\n'
    }
    if (this.state.paymentID !== 'donation') {
      buttonCode += '  paymentID="' + this.state.paymentID + '"\n'
    }
    buttonCode += '></div>'
		return (
		  <div>
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
      	  {buttonCode}
        </pre>
        <p>
        	Feel free to change any of the values in the above code block
          except your merchant ID, which is how you'll get paid.
        </p>
      </div>
		)
	}
	 
	renderMoreInfo = () => {
	  return (
	    <div>
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
        <center>
        <PayButton
  				merchantID="ef0fcea08bfa9cb0"
  				paymentID="donation-gateway.cash"
  				currency="BCH"
  				amount="0"
  				buttonText="Make a Donation"
  				dialogTitle="Make a Donation"
				/>
				</center>
			</div>
	  )
	}
	 
  render () {
    return (
      <div className="container">
        <NavigationMenu
          page="Create a Button"
          updateView={this.props.updateView}
        />
        {this.renderCreationForm()}
        {this.renderGeneratedCode()}
        {this.renderMoreInfo()}
      </div>
    )
  }
  
}

export default CreateButtonPage
