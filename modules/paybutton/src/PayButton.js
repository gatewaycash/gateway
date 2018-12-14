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
    console.error('GATEWAY: Error:\n\n', errorText)
    return errorText
  } else {
    var errorText = "We're sorry, but an error is preventing you from "
    errorText += 'making your payment. For help, please contact the '
    errorText += 'merchant, or send an email to support@gateway.cash.\n\n'
    errorText += 'The error was:\n\n' + error.error + '\n\n' + error.description
    console.error('GATEWAY: Error:\n\n', errorText)
    return errorText
  }
}

/**
 * Parses and validates the data given as props to the PayButton, requesting
 * information from various APIs as needed in order to generate the invoice.
 * @param  {object} data - An object containing the props to be parsed
 * @return {object} - Parsed and validated data
 */
let parseProps = (data) => {
  // valid protocols for URLs
  let validProtocols = ['http://', 'https://']

  // find the API basepoint URL
  let APIURL = data.gateway ? data.gateway : 'https://api.gateway.cash'

  // check the provided API basepoint URL for sanity
  if (!validProtocols.some((x) => APIURL.startsWith(x))) {
    return showError(
      'API basepoint URL does not start with http:// or https://'
    )
  }

  // Parse the amount. When 0, any amount may be paid
  let amount = data.amount ? data.amount : 0
  if (isNaN(amount)) {
    return showError('The amount provided is not a number!')
  }

  // no negative amounts may be provided
  amount = Math.abs(amount)

  // Parse the currency. Default is to use BCH
  let currency = data.currency ? data.currency : 'BCH'
  let supportedCurrencies = ['BCH', 'USD', 'EUR', 'CNY', 'JPY']
  if (!supportedCurrencies.some((x) => currency)) {
    return showError('The currency you provided is not supported!')
  }

  // Set the callback URL. Default is an empty string
  let callbackURL = data.callbackURL ? data.callbackURL : ''

  // check the callback URL length for sanity
  if (callbackURL !== '' && callbackURL.length > 250) {
    return showError('Callback URL must be shorter than 250 characters!')
  }

  // check the protocol of the callback URL for sanity
  if (
    callbackURL !== '' &&
    !validProtocols.some((x) => callbackURL.startsWith(x))
  ) {
    return showError('Callback URL does not start with http:// or https://')
  }

  // verify the length of the payment ID for sanity
  let paymentID = data.paymentID ? data.paymentID : ''
  if (paymentID !== '' && paymentID.length > 64) {
    return showError('The payment ID cannot be longer than 64 characters!')
  }

  // set a default value for button text if not provided
  let buttonText = data.buttonText ?
    data.buttonText :
    'PAY WITH BITCOIN CASH'

  // set a default value for the dialog title if not provided
  let dialogTitle = data.dialogTitle ?
    data.dialogTitle :
    'Complete Your Payment'

  // check the direct deposit address for validity, if provided
  let address = ''
  if (data.address) {
    // verify the address is valid, translating to CashAddress if needed
    try {
      address = bchaddr.toCashAddress(data.address)
    } catch (e) {}
    if (address === '') {
      return showError('The BCH address provided is invalid!')
    }
  }

  // check the merchant ID for sanity, if one was provided
  let merchantID = data.merchantID ? data.merchantID : ''
  if (merchantID !== '' && merchantID.length !== 16) {
    return showError('Merchant ID was not 16 characters!')
  }

  // fail if neither a merchant ID nor an address were provided
  if (!merchantID && !address) {
    return showError('Either an address or a merchantID is required!')
  }

  // return the parsed data
  let parsedData = {
    buttonText: buttonText,
    dialogTitle: dialogTitle,
    amount: amount,
    currency: currency,
    merchantID: merchantID,
    paymentID: paymentID,
    callbackURL: callbackURL,
    address: address,
    APIURL: APIURL
  }
  return parsedData
}

export default (props) => {
  let parsedData = parseProps(props)
  if (typeof parsedData !== 'object') {
    return (
      <div style={{ display: 'inline-block', padding: '0.25em' }}>
        <Button
          onClick={ () => { alert(parsedData) } }
          variant="contained"
          color="secondary"
        >
          ERROR!
        </Button>
      </div>
    )
  }
  let [dialogOpen, setDialogOpen] = React.useState(false)
  let [paymentComplete, setPaymentComplete] = React.useState(false)
  let [paymentAddress, setPaymentAddress] = React.useState(parsedData.address)
  let [amountBCH, setAmountBCH] = React.useState(0)
  let [walletURL, setWalletURL] = React.useState('loading...')
  let [QRCodeURL, setQRCodeURL] = React.useState('loading...')
  let [buttonText, setButtonText] = React.useState(parsedData.buttonText)
  let [dialogTitle, setDialogTitle] = React.useState(parsedData.dialogTitle)
  let [currency, setCurrency] = React.useState(parsedData.currency)
  let [amount, setAmount] = React.useState(parsedData.amount)
  let sock

  // When the payment button is clicked, generate a new invoice
  let handleClick = async () => {

    // create a ninvoice only when a payment has not yet been sent
    if (!paymentComplete) {

      // set the amount multiplier based on the currency
      let amountMultiplier = 1.0
      if (currency !== 'BCH') {
        let marketData = await axios.get({
          url: 'https://apiv2.bitcoinaverage.com/indices/global/ticker/BCH' +
          currency,
        })
        let exchangeRate = JSON.parse(marketData).averages.day
        amountMultiplier = 1 / exchangeRate
      }

      // multiply amount of fiat by amount multiplier to get amount of BCH
      setAmountBCH(amount * amountMultiplier)

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
        } else {
          setPaymentAddress(invoiceResult.paymentAddress)
        }
      }

      // make sure a payment address was set either way
      if (!paymentAddress) {
        showError('We did not find a payment address!')
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
      setWalletURL(walletURL)
      setQRCodeURL(QRCodeURL)

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
