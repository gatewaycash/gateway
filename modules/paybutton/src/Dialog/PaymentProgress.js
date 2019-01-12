import React from 'react'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import styles from 'jss/PaymentProgress'
import withStyles from '@material-ui/core/styles/withStyles'

let PaymentProgress = ({
  classes,
  amountBCH,
  paymentAddress,
  hideWalletButton,
  hideAddressText
}) => (
  <div className={classes.container}>
    <span>
    <center>
      Send {amountBCH || 'some'} Bitcoin&nbsp;Cash (BCH) to this address to
      complete your payment
    </center>
    </span>
    <img
      className={classes.qrCode}
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
      title="Payment QR code"
      poster="Payment QR code"
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
        className={classes.hideWalletButton}
        color="primary"
        href={
          amountBCH > 0
            ? paymentAddress + '?amount=' + amountBCH
            : paymentAddress
        }
      >
        OPEN WALLET
      </Button>
    )}
  </div>
)

PaymentProgress.propTypes = {
  classes: PropTypes.object,
  amountBCH: PropTypes.any.isRequired,
  paymentAddress: PropTypes.string.isRequired,
  hideWalletButton: PropTypes.bool.isRequired,
  hideAddressText: PropTypes.bool.isRequired
}

export default withStyles(styles)(PaymentProgress)
