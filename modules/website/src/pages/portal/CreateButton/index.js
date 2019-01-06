import React, { Component } from 'react'
import NavigationMenu from '../NavigationMenu'
import PreviewButton from './PreviewButton'
import PaymentIDInfo from './PaymentIDInfo'
import ClientCodeExample from './ClientCodeExample'
import SupportProject from './SupportProject'
import { merchantid } from 'API'
import { Footer, Text, Container } from 'components'

import {
  FormControlLabel,
  TextField,
  Switch,
  Button
} from '@material-ui/core'

class CreateButtonPage extends Component {
  state = {
    merchantID: 'loading',
    paymentID: 'donation',
    buttonText: 'Donate',
    dialogTitle: 'Complete Your Payment',
    currency: 'BCH',
    amount: '0',
    advanced: false,
    anyAmount: true,
    callbackURL: '',
  }

  constructor(props) {
    super(props)

    merchantid().then((response) => {
      if (response.status === 'success') {
        this.setState({
          merchantID: response.merchantID
        })
      }
    })
  }

  toggleAdvanced = () => {
    this.setState({ advanced: this.state.advanced ? false : true })
  }

  render() {
    return (
      <>
        <NavigationMenu page="Create a Button" />
        <Container>
          <h2>Customize Your Button</h2>
          <Text>
            Use the settings below to change various aspects of your payment
            button. Once you're satisfied with the result, scroll down and copy
            the generated code onto any website where you'd like to accept
            payments.
          </Text>
          <TextField
            style={{
              width: '100%'
            }}
            onChange={(e) => {
              this.setState ({
                buttonText: e.target.value.substr(0, 25)
              })
            }}
            label="Button Text"
            helperText="Give your payment button a label"
            value={this.state.buttonText}
          />
          <br />
          <br />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.anyAmount}
                onChange={(e) => this.setState({anyAmount: e.target.checked})}
                color="primary"
              />
            }
            label="Allow any amount"
          />
          {!this.state.anyAmount && (
            <div
              style={{
                display: 'block'
              }}
            >
              <TextField
                style={{
                  width: '60%',
                  float: 'left',
                }}
                onChange={(e) => this.setState({amount: e.target.value})}
                label="Payment Amount"
                helperText={'Amount (' + this.state.currency + ')'}
                type="number"
                value={this.state.amount}
              />
              <TextField
                style={{
                  width: '30%',
                  float: 'right',
                }}
                onChange={(e) => {
                  this.setState({
                    currency: e.target.value.toUpperCase().substr(0, 3)
                  })
                }}
                label="Currency"
                helperText="BCH, USD, EUR..."
                maxLength={3}
                value={this.state.currency}
              />
              <br />
              <br />
              <br />
              <br />
            </div>
          )}
          {this.state.advanced ? (
            <div>
              <TextField
                style={{
                  width: '100%',
                }}
                onChange={(e) => {
                  this.setState({
                    dialogTitle: e.target.value.substr(0, 50)
                  })
                }}
                label="Dialog Title"
                helperText="Title for payment dialog box"
                maxLength={25}
                value={this.state.dialogTitle}
              />
              <br />
              <br />
              <TextField
                style={{
                  width: '100%',
                }}
                onChange={(e) => {
                  this.setState({
                    paymentID: e.target.value.substr(0, 32)
                  })
                }}
                label="Payment ID"
                helperText="Unique ID for payments sent to this button (see below)"
                maxLength={32}
                value={this.state.paymentID}
              />
              <br />
              <br />
              <TextField
                style={{
                  width: '100%',
                }}
                onChange={(e) => this.setState({callbackURL: e.target.value})}
                label="Callback URL"
                helperText="We'll notify this URL when a payment is made (see below)"
                maxLength={64}
                value={this.state.callbackURL}
              />
              <br />
              <br />
            </div>
          ) : (
            <div>
              <p>
                If you're looking for more advanced functionality, you can
                further customize your button with some additional tweaks.
              </p>
              <center>
                <Button color="primary" onClick={this.toggleAdvanced}>
                  Advanced Options
                </Button>
              </center>
            </div>
          )}
        </Container>
        <ClientCodeExample {...this.state} />
        <PreviewButton {...this.state} />
        <PaymentIDInfo />
        <SupportProject />
        <Footer />
      </>
    )
  }
}

export default CreateButtonPage
