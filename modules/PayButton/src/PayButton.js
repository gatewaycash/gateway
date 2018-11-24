import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from './Dialog'
import PaymentComplete from './Dialog/PaymentComplete'
import PaymentProgress from './Dialog/PaymentProgress'

let showError = (error) => {
  var errorText = "We're sorry, but an error is preventing you from "
  errorText += 'making your payment. For help, please contact the '
  errorText += 'merchant, or send an email to support@gateway.cash.\n\n'
  errorText += 'The error was:\n\n' + error
  alert(errorText)
  console.error('Payment error', errorText)
  return errorText
}

let transformData = (d) => {
  let merchantID
  if (!d.merchantID || d.merchantID.toString().length !== 16) {
    merchantID = 'invalid'
    console.error('Gateway: WARNING! No Merchant ID was given to a button!')
  }

  let callbackURL
  if (!d.callbackURL || typeof d.callbackURL !== 'string') {
    callbackURL = 'None'
  } else if (d.callbackURL.length > 128) {
    console.error('Gateway: CallbackURL too long!')
    console.error('Gateway: Shortening CallbackURL to 128 characters')
    callbackURL = d.callbackURL.slice(0, 128)
  }

  let validProtocols = ['http://', 'https://']
  if (!validProtocols.some((x) => callbackURL.startsWith(x))) {
    console.error('Gateway: Invalid callbackURL passed to button!')
    callbackURL = 'None'
  }

  return {
    buttonText: d.buttonText || 'Donate',
    dialogTitle: d.dialogTitle || 'Complete Your Payment',
    amount: Math.abs(Number(d.amount)) || 0,
    currency: d.currency
      ? d.currency
          .toString()
          .substr(0, 3)
          .toUpperCase()
      : 'BCH',
    merchantID,
    CallbackURL,
  }
}

export default (props) => {
  let [dialogOpen, setDialogOpen] = React.useState(false)
  let [paymentComplete, setPaymentComplete] = React.useState(false)
  let [address, setAddress] = React.useState('loading...')

  let {
    buttonText,
    dialogTitie,
    amount,
    currency,
    paymentID,
    merchantID,
    callbackURL,
  } = transformData(props)

  let handleClick = () => {
    if (paymentComplete) {
      setDialogOpen(true)
    } else {
      console.log('Gateway: Creating payment request')
      var requestURL = 'https://gateway.cash/api/pay'
      requestURL += '?merchantID=' + encodeURIComponent(this.merchantID)
      requestURL += '&paymentID=' + encodeURIComponent(this.paymentID)
      requestURL += '&callbackURL=' + encodeURIComponent(this.callbackURL)
      var xhr = new XMLHttpRequest()
      xhr.open('GET', requestURL)
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      xhr.onload = () => {
        if (xhr.readyState === 4) {
          var response = xhr.responseText.toString()
          if (!response.startsWith('bitcoincash:')) {
            showError(response)
          } else {
            console.log('Gateway: Pay to adress', response)
            this.QRCodeURL = 'https://chart.googleapis.com/'
            this.QRCodeURL += 'chart?chs=300x300&cht=qr&chl='
            this.QRCodeURL += response + '?label=Payment'
            this.walletURL = response + '?label=Payment'
            if (amount > 0) {
              this.QRCodeURL += '&amount=' + this.amount
              this.walletURL += '&amount=' + this.amount
            }
            this.setState({ address: response, dialogOpen: true })
            // TODO change to rest.bitcoin.com
            this.sock = new WebSocket('wss://bitcoincash.blockexplorer.com')
            this.sock.on('connect', () => {
              this.sock.emit('subscribe', 'inv')
            })
            this.sock.on('disconnect', () => {
              console.log('Gateway: Payment server disconnected')
              console.log(
                'Gateway: This does not mean that your payment failed',
              )
            })
            this.sock.on('error', () => {
              console.error('Gateway: Error listening for payments')
              console.log(
                'Gateway: This does not mean that your payment failed',
              )
            })
            this.sock.on('tx', (data) => {
              this.handlePayment(data)
            })
          }
        }
      }
      xhr.send()
    }
  }
  //
  // handleClose = () => {
  //   this.sock.close()
  //   if (this.state.paymentComplete === false) {
  //     console.log('Gateway: Payment canceled')
  //   }
  //   this.setState({ dialogOpen: false })
  // }
  //
  // handlePayment = (data) => {
  //   var valid = false
  //   for (var i = 0, l = data.vout.length; i < l; i++) {
  //     var obj = Object.getOwnPropertyNames(data.vout[i])
  //     for (var j = 0; j < obj.length; j++) {
  //       if (obj[j] === this.state.address) {
  //         valid = true
  //       }
  //     }
  //   }
  //   if (valid) {
  //     this.setState({ paymentComplete: true })
  //     new Audio('https://gateway.cash/audio/ding.mp3').play()
  //     console.log('Gateway: Payment sent to address')
  //     console.log('Gateway: Payment TXID:', data.txid)
  //     this.sendPaymentToServer(data.txid)
  //   }
  // }
  //
  // sendPaymentToServer = (txid) {
  //   var requestURL = 'https://gateway.cash/api/paymentsent'
  //   requestURL += '?txid=' + txid
  //   requestURL += '&address=' + this.state.address
  //   var xhr = new XMLHttpRequest()
  //   xhr.open('GET', requestURL)
  //   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  //   xhr.onload = () => {
  //     if (xhr.status === 200) {
  //       console.log('Gateway: Payment received by server')
  //       console.log('Gateway: Server response was', xhr.responseText)
  //     } else {
  //       console.error('Gateway: Server sent status code', xhr.status)
  //       console.error('Gateway: Payment will still reach merchant')
  //     }
  //   }
  //   xhr.send()
  // }

  return (
    <div style={{ display: 'inline-block', padding: '0.25em' }}>
      <Button onClick={handleClick} variant="contained" color="primary">
        {this.buttonText}
      </Button>
      <Dialog
        open={this.state.dialogOpen}
        keepMounted
        onClose={this.handleClose}
        title={this.state.paymentComplete ? 'Thank you!' : this.dialogTitle}
      >
        {this.state.paymentComplete ? (
          <PaymentComplete />
        ) : (
          <PaymentProgress
            amount={this.amount}
            QRCodeURL={this.QRCodeURL}
            address={this.state.address}
            walletURL={this.walletURL}
          />
        )}
      </Dialog>
    </div>
  )
}
