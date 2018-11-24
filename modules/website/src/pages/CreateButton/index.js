import React, { Component } from 'react'
import NavigationMenu from 'NavigationMenu'
import PreviewButton from './PreviewButton'
import CreateButtonForm from './CreateButtonForm'
import PaymentIDInfo from './PaymentIDInfo'
import ClientCodeExample from './ClientCodeExample'
import SupportProject from './SupportProject'

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

  render() {
    return (
      <div className="container">
        <NavigationMenu page="Create a Button" />
        <div className="leftPanel">
          <CreateButtonForm />
        </div>
        <div className="rightPanel">
          <ClientCodeExample />
          <PreviewButton />
        </div>
        <div className="leftPanel">
          <div>
            <PaymentIDInfo />
          </div>
        </div>
        <div className="rightPanel">
          <SupportProject />
        </div>
      </div>
    )
  }
}

export default CreateButtonPage
