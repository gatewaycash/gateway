import React, { Component } from 'react'
import { FormControlLabel, Switch } from '@material-ui/core'
import NavigationMenu from './NavigationMenu'
import { payments, merchantid } from 'API'
import PayButton from '@gatewaycash/paybutton'
import { Container, Text, Payment, Footer } from 'components'

class PaymentsPage extends Component {
  state = {
    showUnpaid: false,
    showKeys: false,
    payments: <Text centered>loading...</Text>,
    merchantID: ''
  }

  constructor(props) {
    super(props)
    this.updateView.bind(this)
    merchantid().then((response) => {
      if (response.status === 'success') {
        this.setState({
          merchantID: response.merchantID
        },
        () => {
          this.updateView()
        })
      }
    })
  }

  updateView = () => {
    payments(
      this.state.showKeys ? 'YES' : 'NO',
      this.state.showUnpaid ? 'YES' : 'NO'
    ).then((response) => {
      if (response.status === 'success') {
        let parsedPayments = response.payments.map((payment, key) => (
          <Payment
            {...payment}
            key={key}
          />
        ))
        if (parsedPayments.length < 1) {
          parsedPayments = <center>
            <Text centered>
              No payments yet! Make a test payment and refresh the page.
            </Text>
            <PayButton
              merchantID={this.state.merchantID}
              buttonText="Make a Test Payment"
              dialogTitle="Make Payment and Refresh the Page!"
              paymentID="My first payment"
              gatewayServer={process.env.REACT_APP_GATEWAY_BACKEND}
            />
            <Text centered>
              Your money will be returned to your merchant payout address. it
              may take a few seconds for your payment to appear.
            </Text>
          </center>
        }
        this.setState({
          payments: parsedPayments
        })
      }
    })
  }

  handleKeysChange = e => {
    this.setState({
      showKeys: e.target.checked
    },
    () => {
      this.updateView()
    })
  }

  handleUnpaidChange = e => {
    this.setState({
      showUnpaid: e.target.checked
    },
    () => {
      this.updateView()
    })
  }

  render() {
    return (
      <>
        <NavigationMenu page="Your Payments" />
        <Container halfWidth>
          <h2>View Your Payments</h2>
          <Text>
            This is a list of payments made to your merchant account. They are
            sorted by date, the most recent payments appearing at the top.
          </Text>
          <h3>About Unpaid and Unprocessed Payments</h3>
          <Text>
            Unpaid and unprocessed payments usually occur when a customer clicks
            on a payment button but then closes it without making a payment.
            Pending payments (payments that haven't yet been processed) will
            also fall into this category.
          </Text>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.showUnpaid}
                onChange={this.handleUnpaidChange}
                color="primary"
              />
            }
            label="Show Unpaid and Unprocessed Payments"
          />
          <h3>About Private Keys</h3>
          <Text>
            In short, a private key is like a password that unlocks the funds
            in a cryptocurrency address. Private keys should never be shared
            because anyone with your private keys can spend the money stored in
            the respective address. Likewise, no one can steal money from an
            address without the private key.
          </Text>
          <Text>
            Your Bitcoin wallet generally keeps track of your private keys for
            you. For addresses created by Gateway, we'll manage those keys but
            will optionally share them with you. It's your money after all!
          </Text>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.showKeys}
                onChange={this.handleKeysChange}
                color="secondary"
              />
            }
            label="Show Private Keys"
          />
        </Container>
        <Container halfWidth>
          <h2>Payments</h2>
          {this.state.payments}
        </Container>
        <Footer />
      </>
    )
  }
}

export default PaymentsPage
