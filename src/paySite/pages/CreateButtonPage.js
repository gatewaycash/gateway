import React, {Component} from 'react'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import menu from '@material-ui/core/Menu'
import Paper from '@material-ui/core/Paper'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

import './../MainContent.css'

import NavigationMenu from './../NavigationMenu.js'
import PayButton from './../../payButton/PayButton.js'

class CreateButtonPage extends Component {

  state = {
    merchantID: 'loading',
    paymentID: 'donation',
    buttonText: 'Donate',
    dialogTitle: 'Complete Your Payment',
    currency: 'BCH',
    amount: '0.01',
    advanced: false,
    anyAmount: true,
    callbackURL: 'None'
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
    var buttonText = document.getElementById('buttonTextField').value.toString()
    buttonText = buttonText.substr(0, 25)
    this.setState({
      buttonText: buttonText,
      anyAmount: document.getElementById('allowanyfield').checked
    })
    if (this.state.advanced) {
      var dialogTitle = document.getElementById('dialogTitleField').value
      dialogTitle = dialogTitle.toString().substr(0, 40)
      var paymentID = document.getElementById('paymentIDField').value
      paymentID = paymentID.toString().substr(0, 32)
      var callbackURL = document.getElementById('callbackURLField').value
      callbackURL = callbackURL.toString().substr(0, 64)
      this.setState({
        dialogTitle: dialogTitle,
        paymentID: paymentID,
        callbackURL: callbackURL
      })
    }
    if (this.state.anyAmount === false) {
      var currency = document.getElementById('currencyField').value
      currency = currency.toString().substr(0, 3).toUpperCase()
      this.setState({
        amount: Math.abs(document.getElementById('amountField').value),
        currency: currency
      })
    }
  }

	renderCreationForm = () => {
	  var amountAndCurrency = this.state.anyAmount ? null : (
	    <div>
	      <TextField
          style={{
            width:'70%',
            float:'left'
          }}
          onChange={this.handleChange}
          id="amountField"
          label="Amount"
          helperText="Amount in units of display currency"
          type="number"
          value={this.state.amount}
        />
        <TextField
          style={{
            width:'30%',
            float:'right'
          }}
          onChange={this.handleChange}
          id="currencyField"
          label="Currency"
          helperText="BCH, USD, EUR..."
          maxLength={3}
          value={this.state.currency}
        />
        <br/>
        <br/>
        <br/>
        <br/>
      </div>
	  )
		return (
			<Paper className="paper">
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
        <br/>
        <br/>
        <FormControlLabel
          control={
            <Switch
              id='allowanyfield'
              checked={this.state.anyAmount}
              onChange={this.handleChange}
              color="primary"
            />
          }
          label="Allow any amount"
        />
        {amountAndCurrency}
        {this.renderAdvancedOptions()}
    	</Paper>
		)
	}
	
	renderAdvancedOptions = () => {
		return this.state.advanced ? (
    	<div>
    	  <br/>
    		<TextField
          style={{
            width: '100%'
	        }}
  	      onChange={this.handleChange}
  	      id="dialogTitleField"
  	      label="Dialog Title"
  	      helperText="Title for payment dialog box"
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
  	       id="paymentIDField"
  	       label="Payment ID"
  	       helperText="Unique ID for payments sent to this button (see below)"
  	       maxLength={32}
  	       value={this.state.paymentID}
  	     />
  	     <br/>
  	     <br/>
  	     <TextField
  	       style={{
  	         width:'100%'
  	       }}
  	       onChange={this.handleChange}
  	       id="callbackURLField"
  	       label="Callback URL"
  	       helperText="We'll notify this URL when a payment is made (see below)"
  	       maxLength={64}
  	       value={this.state.callbackURL}
  	     />
  	     <br/>
  	     <br/>
  	  </div>
    ) : (
      <div>
        <p>
          If you're looking for more advanced functionality, you can further
          customize your button with some additional tweaks.
        </p>
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
    if (this.state.buttonText.toString() !== 'Donate') {
      buttonCode += '  buttonText="' + this.state.buttonText + '"\n'
    }
    if (this.state.amount !== '0' && this.state.anyAmount === false) {
      buttonCode += '  amount="' + this.state.amount + '"\n'
    }
    if (this.state.currency.toString().toLowerCase() !== 'bch' &&
        this.state.anyAmount === false) {
      buttonCode += '  currency="' + this.state.currency + '"\n'
    }
    if (this.state.dialogTitle.toString() !== 'Complete Your Payment') {
      buttonCode += '  dialogTitle="' + this.state.dialogTitle + '"\n'
    }
    if (this.state.paymentID !== 'donation') {
      buttonCode += '  paymentID="' + this.state.paymentID + '"\n'
    }
    buttonCode += '></div>'
		return (
		  <Paper className="paper">
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
      </Paper>
		)
	}
	 
  renderPreviewButton = () => {
	  return (
	    <Paper className="paper">
	      <h2>Button Preview</h2>
  	    <p>
	        This is what your finished button will look like and how it will
	        behave. Payments made to the button on this page will be sent to your
	        address.
	      </p>
	      <center>
	      <PayButton
	        merchantID={this.state.merchantID}
	        buttonText={this.state.buttonText}
	        amount={this.state.anyAmount ? '0' : this.state.amount}
	        currency={this.state.currency}
	        dialogTitle={this.state.dialogTitle}
	        paymentID={this.state.paymentID}
	      />
	      </center>
	    </Paper>
	  )
	}
	 
	renderMoreInfo = () => {
	  return (
	    <div>
	    <Paper className="paper">
	      <h2>More Info About Payment IDs</h2>
        <p>
        	The optional Payment ID property can be used to help you keep
          track of different payments made to your merchant account.
          For example, if you're selling T-shirts and you want to know who
          has paid for their order, you can set a payment ID equal to your
          order number. Since payment IDs show up in the View Payments page,
          you'll know which orders have been paid for and are ready to ship.
        </p>
      </Paper>
      <Paper className="paper">
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
      </Paper>
			</div>
	  )
	}
	 
	renderSupportProject = () => {
	  return (
	    <Paper className="paper">
        <h2>Support the Project</h2>
        <p>
        	If you like this project and want to see it get even better for both
        	merchants and customers, please consider a donation. Optionally, you
        	can also choose to donate a portion of each payment made to your
        	merchant account from Settings.
        </p>
        <center>
        <PayButton
  				merchantID="ef0fcea08bfa9cb0"
				/>
				</center>
			</Paper>
	  )
	}
	 
  render () {
    return (
      <div className="container">
        <NavigationMenu
          page="Create a Button"
          updateView={this.props.updateView}
        />
        <div className="leftPanel">
          {this.renderCreationForm()}
        </div>
        <div className="rightPanel">
          {this.renderGeneratedCode()}
          {this.renderPreviewButton()}
        </div>
        <div className="leftPanel">
          {this.renderMoreInfo()}
        </div>
        <div className="rightPanel">
          {this.renderSupportProject()}
        </div>
      </div>
    )
  }
  
}

export default CreateButtonPage
