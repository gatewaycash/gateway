import React, { Component } from 'react'
import { Button } from '@material-ui/core'
import PropTypes from 'prop-types'

class PaymentProgress extends Component {
  render() {
    let {
      amountBCH,
      paymentAddress,
      hideWalletButton,
      hideAddressText
    } = this.props
    return (
      <center>
        <p
          style={{
            marginLeft: '0.5em',
            marginRight: '0.5em',
            marginTop: '-1.5em'
          }}
        >
          Send {amountBCH == 0 ? 'some' : amountBCH} Bitcoin&nbsp;Cash (BCH) to
          this address to complete your payment
        </p>
        <img
          src={
            amountBCH > 0
              ? 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' +
                paymentAddress +
                '?amount=' +
                amountBCH
              : 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' +
                paymentAddress
          }
          alt="Payment QR code"
          style={{
            width: '15em',
            margin: 'auto',
            marginTop: '-1em',
            marginBottom: '-1.5em',
            align: 'center'
          }}
        />
        {hideAddressText || (
          <p
            style={{
              width: '17em',
              fontFamily: 'monospace',
              fontSize: '0.8em',
              lineHeight: '100%',
              wordWrap: 'break-word'
            }}
          >
            {paymentAddress}
          </p>
        )}
        {hideWalletButton || (
          <Button
            variant="contained"
            color="primary"
            style={{
              display: 'flex',
              width: 'fit-content'
            }}
            href={
              amountBCH > 0
                ? paymentAddress + '?amount=' + amountBCH
                : paymentAddress
            }
          >
            OPEN WALLET
          </Button>
        )}
      </center>
    )
  }
}

PaymentProgress.propTypes = {
  amountBCH: PropTypes.number,
  paymentAddress: PropTypes.string,
  hideWalletButton: PropTypes.bool,
  hideAddressText: PropTypes.bool
}

export default PaymentProgress
