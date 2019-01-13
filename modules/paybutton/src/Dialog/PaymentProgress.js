import React from 'react'
import Button from '@material-ui/core/Button'
import QRCode from 'qrcode.react'
import PropTypes from 'prop-types'
import styles from '../jss/PaymentProgress'
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
        Send {amountBCH == 0 ? 'some' : amountBCH} Bitcoin&nbsp;Cash (BCH) to
        this address to complete your payment
      </center>
    </span>
    <QRCode
      className={classes.qrCode}
      renderAs='svg'
      size={320}
      value={
        amountBCH > 0 ? paymentAddress + '?amount=' + amountBCH : paymentAddress
      }
      alt="Payment QR code"
      title="Payment QR code"
      poster="Payment QR code"
    />
    {hideAddressText || (
      <center>
        <p
          style={{
            width: '17em',
            fontFamily: 'monospace',
            fontSize: '0.8em',
            lineHeight: '100%',
            wordWrap: 'break-word',
            textAlign: 'center'
          }}
        >
          {paymentAddress}
        </p>
      </center>
    )}
    {hideWalletButton || (
      <Button
        variant="contained"
        className={classes.walletButton}
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
