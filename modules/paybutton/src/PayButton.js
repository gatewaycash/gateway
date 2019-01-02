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
import io from 'socket.io-client'

/**
 * Displays an error to the user
 * @param  {string} error - The error to display
 */
let showError = (error) => {
  let errorText = "An error might be causing problems with "
  errorText += 'your payment. For help, please contact the '
  errorText += 'merchant, or send an email to support@gateway.cash.\n\n'
  errorText += 'If you are the merchant or a developer, you should reference '
  errorText += 'the Gateway Payment Button documentation for help:\n\n'
  errorText += 'https://gateway.cash/docs\n\n'
  if (typeof error !== 'object') {
    errorText += 'The error was:\n\n' + error
    console.error('GATEWAY: Error:\n\n', errorText)
    return errorText
  } else {
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
  let APIURL = data.gatewayServer ?
    data.gatewayServer :
    'https://api.gateway.cash'

  // check the provided API basepoint URL for sanity
  if (!validProtocols.some((x) => APIURL.startsWith(x))) {
    return showError(
      'API basepoint URL does not start with http:// or https://'
    )
  }

  // find the block explorer websocket URL
  var blockExplorerURL = data.blockExplorer ?
    data.blockExplorer :
    'wss://bch.coin.space'

  // check the provided API basepoint URL for sanity
  if (!['ws://', 'wss://'].some((x) => blockExplorerURL.startsWith(x))) {
    return showError(
      'Block explorer URL does not start with ws:// or wss://'
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
    return showError(
      'The currency you provided is not supported! Supported currencies:',
      supportedCurrencies
    )
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
    return showError('Your Merchant ID needs to be 16 characters!')
  }

  // fail if neither a merchant ID nor an address were provided
  if (!merchantID && !address) {
    return showError(
      'Either an address or a Merchant ID is required! (Merchant XPUB and BIP47 are coming soon)'
    )
  }

  // set the value for the audio file to play when a payment succeeds
  let paymentCompleteAudio = data.paymentCompleteAudio ?
    data.paymentCompleteAudio :
    'https://gateway.cash/audio/ding.mp3'

  // get the value for the payment complete callback function
  let paymentCompleteCallback = data.paymentCompleteCallback ?
    data.paymentCompleteCallback : 'console.log("GATEWAY: Payment complete!\\n\\nTXID: "+window.gatewayPaymentTXID)'

  // ensure the callback is in the correct format
  if (paymentCompleteCallback.endsWith(';')) {
    paymentCompleteCallback = paymentCompleteCallback.substr(
      0,
      paymentCompleteCallback.length - 1
    )
  }
  if (!paymentCompleteCallback.endsWith(')')) {
    paymentCompleteCallback += '()'
  }
  paymentCompleteCallback += ';'

  // set the value for whether to close the dialog when the payment succeeds
  let closeWhenComplete = data.closeWhenComplete ?
    data.closeWhenComplete :
    false

  // set the toggle for payment audio
  let enablePaymentAudio = data.enablePaymentAudio ?
    data.enablePaymentAudio :
    true

  let elementID = data.elementID ?
    data.elementID :
    'pay-' + Math.floor(Math.random() * 100000)

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
    APIURL: APIURL,
    blockExplorerURL: blockExplorerURL,
    paymentCompleteAudio: paymentCompleteAudio,
    paymentCompleteCallback: paymentCompleteCallback,
    closeWhenComplete: closeWhenComplete,
    enablePaymentAudio: enablePaymentAudio,
    elementID: elementID
  }
  return parsedData
}

export default (props) => {
  // validate and parse the prop values
  let parsedData = parseProps(props)

  // show an error button in place of the PayButton if there was an error
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

  // set default state variablevalues
  let [dialogOpen, setDialogOpen] = React.useState(false)
  let [paymentComplete, setPaymentComplete] = React.useState(false)
  let [amountBCH, setAmountBCH] = React.useState(0)
  let [paymentAddress, setPaymentAddress] = React.useState('loading...')
  let [address, setAddress] = React.useState(parsedData.address)
  let [buttonText, setButtonText] = React.useState(parsedData.buttonText)
  let [dialogTitle, setDialogTitle] = React.useState(parsedData.dialogTitle)
  let [currency, setCurrency] = React.useState(parsedData.currency)
  let [amount, setAmount] = React.useState(parsedData.amount)
  let [merchantID, setMerchantID] = React.useState(parsedData.merchantID)
  let [paymentID, setPaymentID] = React.useState(parsedData.paymentID)
  let [callbackURL, setCallbackURL] = React.useState(parsedData.callbackURL)
  let [APIURL, setAPIURL] = React.useState(parsedData.APIURL)
  let [blockExplorerURL, setBlockExplorerURL] = React.useState(
    parsedData.blockExplorerURL
  )
  let [paymentCompleteAudio, setPaymentCompleteAudio] = React.useState(
    parsedData.paymentCompleteAudio
  )
  let [paymentCompleteCallback, setPaymentCompleteCallback] = React.useState(
    parsedData.paymentCompleteCallback
  )
  let [closeWhenComplete, setCloseWhenComplete] = React.useState(
    parsedData.closeWhenComplete
  )
  let [enablePaymentAudio, setEnablePaymentAudio] = React.useState(
    parsedData.enablePaymentAudio
  )
  let [paymentAudio, setPaymentAudio] = React.useState(
    new Audio(paymentCompleteAudio)
  )
  let [sock, setSock] = React.useState(false)
  let [elementID, setElementID] = React.useState(parsedData.elementID)

  // When the payment button is clicked, generate a new invoice
  let handleClick = async () => {

    // create a ninvoice only when a payment has not yet been sent
    if (!paymentComplete) {

      // set the amount multiplier based on the currency
      let amountMultiplier = 1.0
      if (currency !== 'BCH') {
        let marketDataURL =
          'https://apiv2.bitcoinaverage.com/indices/global/ticker/BCH' +
          currency
        let marketData = await axios.get(marketDataURL)
        let exchangeRate = marketData.data.averages.day
        console.log(
          'GATEWAY: Current',
          'BCH/' + currency,
          'exchange rate:',
          exchangeRate
        )
        amountMultiplier = 1 / exchangeRate
      }

      // multiply amount of fiat by amount multiplier to get amount of BCH
      setAmountBCH((amount * amountMultiplier).toFixed(6))
      amountBCH = (amount * amountMultiplier).toFixed(6)

      // if no address was given, and a merchantID was given, use the merchantID
      if (!address && merchantID) {
        try {
          let invoiceResult = await axios.post(APIURL + '/pay', {
            merchantID: merchantID,
            paymentID: paymentID,
            callbackURL: callbackURL
          })
          if (invoiceResult.data.status === 'error') {
            alert(showError(invoiceResult.data))
            return
          } else {
            setPaymentAddress(invoiceResult.data.paymentAddress)
            paymentAddress = invoiceResult.data.paymentAddress
          }
        } catch (e) {
          alert(showError(
            'We\'re having some trouble contacting the Gateway server!'
          ))
          return
        }

      // if a direct deposit address was given, use it for payment address
      } else {
        setPaymentAddress(address)
        paymentAddress = address
      }

      // verify payment address was set either way
      if (!paymentAddress || paymentAddress === 'loading...') {
        alert(showError('We did not find a payment address!'))
      }

      // TODO change to rest.bitcoin.com
      sock = io(blockExplorerURL)
      setSock(sock)
      sock.on('connect', () => {
        sock.emit('subscribe', 'inv')
        console.log('GATEWAY: Connected to block explorer!')
      })
      sock.on('disconnect', () => {
        console.log('GATEWAY: Disconnected from block explorer')
        console.log(
          'GATEWAY: This does not mean that your payment failed',
        )
      })
      sock.on('error', () => {
        console.log('GATEWAY: Disconnected from block explorer')
        console.log(
          'GATEWAY: This does not mean that your payment failed',
        )
      })
      sock.on('tx', handlePayment)
    }
    setDialogOpen(true)
  }

  // checks payment destinations to see if they concern this transaction
  let handlePayment = async (data) => {
    let valid = false
    for (var i = 0, l = data.vout.length; !valid && i < l; i++) {
      let obj = Object.getOwnPropertyNames(data.vout[i])
      for (var j = 0; !valid && j < obj.length; j++) {
        try {
          let comparisonAddress = bchaddr.toCashAddress(obj[j])
          if (comparisonAddress === paymentAddress) {
            valid = true
          }
        } catch (e) {
          return
        }
      }
    }

    if (valid) {

      // send payment to Gateway server if it was not direct deposit
      if (!address) {
        await sendPaymentToServer(data.txid)
      }

      // update the state
      setPaymentComplete(true)

      // play the audio clip if enabled
      if (enablePaymentAudio) {
        paymentAudio.play()
      }

      // close the dialog when completed, if requested
      if (closeWhenComplete) {
        handleClose()
      }

      // call the local website callback, if requested
      if (paymentCompleteCallback && paymentCompleteCallback.length > 0) {
        if (typeof window === 'object') {

          // set the TXID global variable
          window.gatewayPaymentTXID = data.txid
          window.gatewayPaymentAddress = paymentAddress
          window.gatewayPaymentAmountBCH = amountBCH
        }

        // try and call the callback
        try {
          eval(paymentCompleteCallback)
        } catch (e) {
          showError('Error running your local JavaScript callback!')
        }
      }
    }
  }

  // when the dialog box is closed, close the WebSocket
  let handleClose = () => {
    sock.close()
    setDialogOpen(false)
  }

  // when we find a matching payment, send it to the server to mark invoice paid
  let sendPaymentToServer = async (txid) => {
    try {
      let paymentResponse = await axios.post(APIURL + '/paid',
        {
          paymentAddress: paymentAddress,
          paymentTXID: txid
        }
      )
      if (paymentResponse.data.status === 'error') {
        showError(paymentResponse.data)
      }
    } catch (e) {
      alert(showError(
        'If you sent the funds, your payment has been received. However, Gateway is having trouble getting a receipt for your transaction. If you are concerned this could be a problem, please include this TXID in a support message to Gateway or to your merchant:\n\n' + txid
      ))
    }
  }

  // render everything
  return (
    <div
      style={{
        display: 'inline-block',
        padding: '0.25em'
      }}
      id={elementID}
    >
      <Button
        onClick={handleClick}
        onClose={handleClose}
        variant="contained"
        color="primary"
      >
        {buttonText}
      </Button>
      <Dialog
        open={dialogOpen}
        keepMounted
        onClose={handleClose}
        title={
          paymentComplete ?
            'Thank you!' :
            dialogTitle
        }
      >
        {
          paymentComplete ? (
            <PaymentComplete />
          ) : (
            <PaymentProgress
              amountBCH={amountBCH}
              paymentAddress={paymentAddress}
            />
          )
        }
      </Dialog>
    </div>
  )


}
