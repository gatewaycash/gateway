import React, { Component } from 'react'
import { Button } from '@material-ui/core'
import NavigationMenu from './NavigationMenu'
import { payments } from 'API'
import { Container, Text } from 'components'

class PaymentsPage extends Component {
  state = {
    showUnpaid: false,
    showKeys: false,
    payments: 'loading...'
  }

  constructor(props) {
    super(props)

    payments().then((response) => {
      if (response.status === 'success') {
        this.setState({
          payments: response.payments
        })
      }
    })

  }

  toggleView = () => {
    var xhr = new XMLHttpRequest()
    var requestURL = process.env.REACT_APP_GATEWAY_BACKEND + '/get'
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
          showUnpaid: this.state.showUnpaid ? false : true,
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
        var html = ''

        // TODO: this is very not good. change to jsx
        for (var i = 0; i < payments.length; i++) {
          html += '<div class="payment">'
          html += '<b>Created:</b> ' + payments[i].created + '<br/>'
          html += '<b>Payment ID:</b> ' + payments[i].paymentID + '<br/>'
          html += '<b>Address:</b> <a href="https://explorer.bitcoin.com/'
          html += 'bch/address/' + payments[i].paymentAddress + '"'
          html += 'target="_blank">' + payments[i].paymentAddress + '</a><br/>'
          html += '<b>Payment TXID:</b> <a href="https://explorer.bitcoin.com/'
          html += 'bch/tx/' + payments[i].paymentTXID + '" target="_blank">'
          html += payments[i].paymentTXID + '</a><br/>'
          html += '<b>Payment Amount:</b> '
          html += parseInt(payments[i].paidAmount) / 100000000 + ' BCH<br/>'
          html += '<b>Transfer TXID:</b> <a href="https://explorer.bitcoin.com/'
          html += 'bch/tx/' + payments[i].transferTXID + '" target="_blank">'
          html += payments[i].transferTXID + '</a><br/>'
          html += '</div>'
        }
        return payments.length > 0 ? html : 'No payments yet'
      } catch (e) {
        return 'loading...'
      }
    }
  }

  render() {
    return (
      <>
        <NavigationMenu page="Your Payments" />
        <Container>
          <h2>Your Payments</h2>
          <Text>
            Below is a list of payments made to your merchant account. They are
            sorted by date, the most recent payments appearing at the top.
          </Text>
          <p>This page hasn't been built yet, please check back soon.</p>
          <p>
            To view your payments in the meantime, check your Bitcoin Cash
            wallet. If you are a developer, query api.gateway.cash/payments.
          </p>
          {<div
            dangerouslySetInnerHTML={{
              __html: this.parsePayments(this.state.payments)
            }}
          />}
          <center>
            <Button color="primary" onClick={this.toggleView}>
              {this.state.showUnpaid
                ? 'Show Only Processed Payments'
                : 'Include all Unpaid Payments'}
            </Button>
          </center>
          <h3>About Unpaid and Unprocessed Payments</h3>
          <Text>
            Unpaid and unprocessed payments usually occur when a customer clicks
            on a payment button but then closes it without making a payment.
            Pending payments (payments that haven't yet been processed) will
            also fall into this category.
          </Text>
        </Container>
      </>
    )
  }
}

export default PaymentsPage
