/**
 * Gateway Payment Button React Component
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a React component for the Gateway payment button
 */
import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from './Dialog'
import PaymentComplete from './Dialog/PaymentComplete'
import PaymentProgress from './Dialog/PaymentProgress'
import bchaddr from 'bchaddrjs'
import axios from 'axios'
import 'regenerator-runtime/runtime'

/**
 * Displays an error to the user
 * @param  {string} error - The error to display
 */
let showError = (error) => {
  if (typeof error !== 'object') {
    var errorText = "We're sorry, but an error is preventing you from "
    errorText += 'making your payment. For help, please contact the '
    errorText += 'merchant, or send an email to support@gateway.cash.\n\n'
    errorText += 'The error was:\n\n' + error
    alert(errorText)
    console.error('GATEWAY: Error:\n\n', errorText)
  } else {
    var errorText = "We're sorry, but an error is preventing you from "
    errorText += 'making your payment. For help, please contact the '
    errorText += 'merchant, or send an email to support@gateway.cash.\n\n'
    errorText += 'The error was:\n\n' + error.error + '\n\n' + error.description
    alert(errorText)
    console.error('GATEWAY: Error:\n\n', errorText)
  }
}

/**
 * Parses and validates the data given as props to the PayButton, requesting
 * information from various APIs as needed in order to generate the invoice.
 * @param  {object} data - An object containing the props to be parsed
 * @return {object} - Payment address, amount of BCH and callback URL
 */
let parseProps = async (data) => {
  /*
    Figure out which API server we are using:
    - First we check to see if the "gateway" prop was passed and use that
    - Then we see if the API server was passed in via an environment variable
    - Finally we fall back to https://api.gateway.cash
   */
  let APIURL = data.gateway ? data.gateway : process.env.GATEWAY_API_BASE
  if (!APIURL) {
    APIURL = 'https://api.gateway.cash'
  }

  // Parse the amount. When 0, any amount may be paid
  let amount = data.amount ? data.amount : 0
  if (isNaN(amount)) {
    showError('The amount provided is not a number!')
    return
  }

  // Parse the currency. Default is to use BCH
  let currency = data.currency ? data.currency : 'BCH'
  let supportedCurrencies = ['BCH', 'USD', 'EUR', 'CNY', 'JPY']
  if (!supportedCurrencies.some((x) => currency)) {
    showError('The currency you provided is not supported!')
    return
  }

  // set the amount multiplier based on the currency
  let amountMultiplier = 1.0
  if (currency !== 'BCH') {
    let marketData = await axios.get({
      url: 'https://apiv2.bitcoinaverage.com/indices/global/ticker/BCH' + currency,
    })
    let exchangeRate = JSON.parse(marketData).averages.day
    amountMultiplier = 1 / exchangeRate
  }

  // multiply the amount of fiat by the amount multiplier to get the amount BCH
  let amountBCH = amount * amountMultiplier

  // check the callback URL length for sanity
  let callbackURL = data.callbackURL ? data.callbackURL : ''
  if (callbackURL.length > 250) {
    showError('Callback URL must be shorter than 250 characters!')
    return
  }

  // check the protocol of the callback URL for sanity
  let validProtocols = ['http://', 'https://']
  if (!validProtocols.some((x) => callbackURL.startsWith(x))) {
    showError('Callback URL does not start with http:// or https://')
    return
  }

  // verify the length of the payment ID for sanity
  let paymentID = data.paymentID ? data.paymentID : ''
  if (paymentID.length > 64) {
    showError('The payment ID cannot be longer than 64 characters!')
    return
  }

  // set a default value for button text if not provided
  let buttonText = data.buttonText ?
    data.buttonText :
    'PAY WITH BITCOIN CASH'

  // set a default value for the dialog title if not provided
  let dialogTitle = data.dialogTitle ?
    data.dialogTitle :
    'Complete Your Payment'

  // check the direct deposit address for sanity, if provided
  let address = false
  if (data.address) {
    // verify the address is valid, translating to CashAddress if needed
    try {
      address = bchaddr.toCashAddress(data.address)
    } catch (e) {
      showError('The BCH address provided is invalid!')
      return
    }
  }

  // check the merchant ID for sanity, if one was provided
  if (merchantID && merchantID.length !== 16) {
    showError('Merchant ID was not 16 characters!')
    return
  }

  // fail if neither a merchant ID nor an address were provided
  if (!merchantID && !address) {
    showError('Either an address or a merchantID is required!')
    return
  }

  // return the parsed data
  return {
    buttonText: buttonText,
    dialogTitle: dialogTitle,
    amountBCH: amountBCH,
    merchantID: merchantID,
    paymentID: paymentID,
    callbackURL: callbackURL,
    address: address,
    APIURL: APIURL
  }
}

export default async (props) => {
  let [dialogOpen, setDialogOpen] = React.useState(false)
  let [paymentComplete, setPaymentComplete] = React.useState(false)

  // some global variables to keep track of some things
  let sock, paymentAddress, QRCodeURL, walletURL
  let {
    buttonText,
    dialogTitle,
    amountBCH,
    merchantID,
    paymentID,
    callbackURL,
    address,
    APIURL
  } = await parseProps(props)

  // When the payment button is clicked, generate a new invoice
  let handleClick = async () => {

    // create a ninvoice only when a payment has not yet been sent
    if (!paymentComplete) {

      // if no address was given, and a merchantID was given, use the merchantID
      if (!address && merchantID) {
        let invoiceResult = await axios.post({
          url: APIURL + '/pay',
          data: {
            merchantID: merchantID,
            paymentID: paymentID,
            callbackURL: callbackURL
          }
        })
        invoiceResult = JSON.parse(invoiceResult)
        if (invoiceResult.status === 'error') {
          showError(invoiceResult)
          return
        } else {
          paymentAddress = invoiceResult.paymentAddress
        }

      // when a direct deposit address was given, use the address
      } else {
        paymentAddress = address
      }

      // make sure a payment address was set either way
      if (!paymentAddress) {
        showError('We did not find a payment address!')
        return
      }

      // generate URLs for the QR code image and the wallet l
      let QRCodeURL = 'https://chart.googleapis.com/'
      QRCodeURL += 'chart?chs=300x300&cht=qr&chl='
      QRCodeURL += paymentAddress
      let walletURL = paymentAddress
      if (amountBCH > 0) {
        QRCodeURL += '?amount=' + amountBCH
        walletURL += '?amount=' + amountBCH
      }

      // TODO change to rest.bitcoin.com
      sock = new WebSocket('wss://bitcoincash.blockexplorer.com')
      sock.on('connect', () => {
        sock.emit('subscribe', 'inv')
      })
      sock.on('disconnect', () => {
        console.log('Gateway: Payment server disconnected')
        console.log(
          'Gateway: This does not mean that your payment failed',
        )
      })
      sock.on('error', () => {
        console.error('Gateway: Error listening for payments')
        console.log(
          'Gateway: This does not mean that your payment failed',
        )
      })
      sock.on('tx', (data) => {
        handlePayment(data)
      })
    }
    setDialogOpen(true)
  }

  // when the dialog box is closed, close the WebSocket
  let handleClose = () => {
    sock.close()
    if (paymentComplete === false) {
      console.log('Gateway: Payment canceled')
    }
    setDialogOpen(false)
  }

  // when a payment comes through, check if it concerns this transaction
  let handlePayment = (data) => {
    var valid = false
    for (var i = 0, l = data.vout.length; i < l; i++) {
      var obj = Object.getOwnPropertyNames(data.vout[i])
      for (var j = 0; j < obj.length; j++) {
        if (obj[j] === paymentAddress) {
          valid = true
        }
      }
    }
    if (valid) {
      setPaymentComplete(true)
      new Audio('https://gateway.cash/audio/ding.mp3').play()
      console.log('Gateway: Payment sent to address')
      console.log('Gateway: Payment TXID:', data.txid)
      sendPaymentToServer(data.txid)
    }
  }

  // when we find a matching payment, send it to the server to mark invoice paid
  let sendPaymentToServer = async (txid) => {
    let paymentResponse = await axios.post({
      url: APIURL + '/paid',
      data: {
        paymentAddress: paymentAddress,
        paymentTXID: txid
      }
    })
    paymentResponse = JSON.parse(paymentResponse)
    if (paymentResponse.status === 'error') {
      showError(paymentResponse)
    } else {
      console.log('GATEWAY: Payment complete!\n\nTXID: ' + txid)
    }
  }

  // render everything
  return (
    <div style={{ display: 'inline-block', padding: '0.25em' }}>
      <Button onClick={handleClick} variant="contained" color="primary">
        {buttonText}
      </Button>
      <Dialog
        open={dialogOpen}
        keepMounted
        onClose={handleClose}
        title={paymentComplete ? 'Thank you!' : dialogTitle}
      >
        {paymentComplete ? (
          <PaymentComplete />
        ) : (
          <PaymentProgress
            amountBCH={amountBCH}
            QRCodeURL={QRCodeURL}
            paymentAddress={paymentAddress}
            walletURL={walletURL}
            />
          )
        }
      </Dialog>
    </div>
  )


}
