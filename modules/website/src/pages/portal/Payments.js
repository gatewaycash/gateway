import React, { Component } from 'react'
import { FormControlLabel, Switch } from '@material-ui/core'
import NavigationMenu from './NavigationMenu'
import { payments } from 'API'
import { Container, Text, Payment, Footer } from 'components'

class PaymentsPage extends Component {
  state = {
    showUnpaid: false,
    showKeys: false,
    payments: 'loading...'
  }

  constructor(props) {
    super(props)
    this.updateView()
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
        console.log(parsedPayments)
        if (parsedPayments.length < 1) {
          parsedPayments = <Text centered>No payments yet</Text>
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
          <FormControlLabel
            control={
              <Switch
                checked={this.state.showUnpaid}
                onChange={this.handleUnpaidChange}
                color="primary"
              />
            }
            label="Show Unpaid Payments"
          />
          <br />
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
          <h3>About Unpaid and Unprocessed Payments</h3>
          <Text>
            Unpaid and unprocessed payments usually occur when a customer clicks
            on a payment button but then closes it without making a payment.
            Pending payments (payments that haven't yet been processed) will
            also fall into this category.
          </Text>
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
