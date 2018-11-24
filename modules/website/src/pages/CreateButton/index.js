import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper'
import NavigationMenu from 'NavigationMenu'
import PayButton from '@gateway/PayButton'
import PreviewButton from './PreviewButton'
import CreateButtonForm from './CreateButtonForm'

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
    callbackURL: 'None',
  }

  constructor(props) {
    super(props)

    // get the merchant ID
    let xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://gateway.cash/api/getmerchantid')
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onload = () => {
      if (xhr.readyState === 4) {
        let response = xhr.responseText.toString().trim()
        if (response.length === 16 && response.indexOf(' ') === -1) {
          this.setState({ merchantID: response })
        } else {
          alert('Error: \n\n' + response)
        }
      }
    }
    xhr.send()
  }

  toggleAdvanced = () => {
    this.setState({ advanced: this.state.advanced ? false : true })
  }

  handleChange = () => {
    var buttonText = document.getElementById('buttonTextField').value.toString()
    buttonText = buttonText.substr(0, 25)
    this.setState({
      buttonText: buttonText,
      anyAmount: document.getElementById('allowanyfield').checked,
    })
    if (this.state.advanced) {
      var dialogTitle = document.getElementById('dialogTitleField').value
      dialogTitle = dialogTitle.toString().substr(0, 40)
      var paymentID = document.getElementById('paymentIDField').value
      paymentID = paymentID.toString().substr(0, 32)
      var callbackURL = document.getElementById('callbackURLField').value
      callbackURL = callbackURL.toString().substr(0, 128)
      this.setState({
        dialogTitle: dialogTitle,
        paymentID: paymentID,
        callbackURL: callbackURL,
      })
    }
    if (this.state.anyAmount === false) {
      var currency = document.getElementById('currencyField').value
      currency = currency
        .toString()
        .substr(0, 3)
        .toUpperCase()
      var amount = Math.abs(document.getElementById('amountField').value)
      amount = amount.toString()
      while (amount.startsWith('0')) {
        amount = amount.substr(1)
      }
      if (amount.startsWith('.')) {
        amount = '0' + amount
      }
      this.setState({
        amount: amount,
        currency: currency,
      })
    }
  }

  renderGeneratedCode = () => {
    var buttonCode = '<div\n  class="payButton"\n'
    buttonCode += '  merchantID="' + this.state.merchantID + '"\n'
    if (this.state.buttonText.toString() !== 'Donate') {
      buttonCode += '  buttonText="' + this.state.buttonText + '"\n'
    }
    if (this.state.amount !== '0' && this.state.anyAmount === false) {
      buttonCode += '  amount="' + this.state.amount + '"\n'
    }
    if (
      this.state.currency.toString().toLowerCase() !== 'bch' &&
      this.state.anyAmount === false
    ) {
      buttonCode += '  currency="' + this.state.currency + '"\n'
    }
    if (this.state.dialogTitle.toString() !== 'Complete Your Payment') {
      buttonCode += '  dialogTitle="' + this.state.dialogTitle + '"\n'
    }
    if (this.state.paymentID !== 'donation') {
      buttonCode += '  paymentID="' + this.state.paymentID + '"\n'
    }
    if (
      this.state.callbackURL !== 'None' &&
      (this.state.callbackURL.toString().startsWith('https://') ||
        this.state.callbackURL.toString().startsWith('http://'))
    ) {
      buttonCode += '  callbackURL="' + this.state.callbackURL + '"\n'
    }
    buttonCode += '></div>'
    return (
      <Paper className="paper">
        <h2>Generated Code</h2>
        <p>
          Add this line of HTML once on each page you want to accept payments
          on:
        </p>
        <pre className="sourceCode">
          {`<script src="https://gateway.cash/pay.js"></script>`}
        </pre>
        <p>
          Add this code wherever you want to place a payment button. You can put
          as many buttons on the same page as you'd like:
        </p>
        <pre className="sourceCode">{buttonCode}</pre>
        <p>
          Feel free to change any of the values in the above code block except
          your merchant ID, which is how you'll get paid.
        </p>
      </Paper>
    )
  }

  render() {
    return (
      <div className="container">
        <NavigationMenu page="Create a Button" />
        <div className="leftPanel">
          <CreateButtonForm />
        </div>
        <div className="rightPanel">
          {this.renderGeneratedCode()}
          <PreviewButton />
        </div>
        <div className="leftPanel">
          <div>
            <Paper className="paper">
              <h2>More Info About Payment IDs</h2>
              <p>
                The optional Payment ID property can be used to help you keep
                track of different payments made to your merchant account. For
                example, if you're selling T-shirts and you want to know who has
                paid for their order, you can set a payment ID equal to your
                order number. Since payment IDs show up in the View Payments
                page, you'll know which orders have been paid for and are ready
                to ship.
              </p>
            </Paper>
            <Paper className="paper">
              <h2>A Note on How Payments Are Processed</h2>
              <p>
                The site generates an address for each payment and securely
                stores the key. The moment the customer pays, the Bitcoin Cash
                network instantly validates the payment and within 3 seconds,
                the customer is done and can move on with their day.
              </p>
              <p>
                New payments are refreshed once every 10 minutes and forwarded
                to merchants as soon as they are detected. About a tenth of a
                cent is deducted from each payment to pay for the transfer fee,
                and if you've chosen to help support the project (off by
                default), your selected amount will also be deducted as well.
                All other funds go to your address.
              </p>
            </Paper>
          </div>
        </div>
        <div className="rightPanel">
          <Paper className="paper">
            <h2>Support the Project</h2>
            <p>
              If you like this project and want to see it get even better for
              both merchants and customers, please consider a donation.
              Optionally, you can also choose to donate a portion of each
              payment made to your merchant account from Settings.
            </p>
            <center>
              <PayButton
                merchantID="ef0fcea08bfa9cb0"
                buttonText="Support gateway.cash"
              />
            </center>
          </Paper>
        </div>
      </div>
    )
  }
}

export default CreateButtonPage
