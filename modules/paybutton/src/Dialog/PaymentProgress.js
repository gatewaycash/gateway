import React from 'react'
import Button from '@material-ui/core/Button'

export default ({ amountBCH, paymentAddress, QRCodeURL, walletURL }) => (
  <center>
    <p
      style={{
        marginLeft: '0.5em',
        marginRight: '0.5em',
        marginTop: '-1.5em',
      }}
    >
      Send {amountBCH || 'some'}
      Bitcoin&nbsp;Cash (BCH) to this address to complete your payment
    </p>
    <img
      src={QRCodeURL}
      alt="Payment QR code"
      style={{
        width: '15em',
        margin: 'auto',
        marginTop: '-1em',
        marginBottom: '-1.5em',
        align: 'center',
      }}
    />
    <p
      style={{
        width: '17em',
        fontFamily: 'monospace',
        fontSize: '0.8em',
        lineHeight: '100%',
        wordWrap: 'break-word',
      }}
    >
      {paymentAddress}
    </p>
    <Button variant="contained" color="primary" href={walletURL}>
      OPEN WALLET
    </Button>
  </center>
)
