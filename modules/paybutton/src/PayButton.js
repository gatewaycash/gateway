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
import io from 'socket.io-client'
import showError from './functions/showError'
import parseProps from './functions/parseProps'
import PropTypes from 'prop-types'

let PayButton = props => {
  props = parseProps(props)

  // detect errors from parseProps
  if (typeof props !== 'object') {
    return (
      <div style={{ display: 'inline-block', padding: '0.25em' }}>
        <Button
          onClick={() => alert(props)}
          variant="contained"
          color="secondary"
        >
          ERROR!
        </Button>
      </div>
    )
  }

  // set the default state
  let [dialogOpen, setDialogOpen] = React.useState(false)
  let [paymentComplete, setPaymentComplete] = React.useState(false)
  let [amountBCH, setAmountBCH] = React.useState(0)
  let [paymentAddress, setPaymentAddress] = React.useState('loading...')
  let [sock, setSock] = React.useState(false)
  let paymentCompleteAudio = new Audio(props.paymentCompleteAudio)

  // When the payment button is clicked, generate a new invoice
  let handleClick = async () => {
    // if the payment was already completed, open the dialog and we are done
    if (paymentComplete) {
      setDialogOpen(true)
      return
    }

    // set the amount multiplier based on the currency
    // TODO put this in its own file
    let amountMultiplier = 1.0
    if (props.currency !== 'BCH') {
      let marketDataURL =
        'https://apiv2.bitcoinaverage.com/indices/global/ticker/BCH' +
        props.currency
      let marketData = await axios.get(marketDataURL)
      let exchangeRate = marketData.data.averages.day
      console.log(
        'GATEWAY: Current',
        'BCH/' + props.currency,
        'exchange rate:',
        exchangeRate
      )
      amountMultiplier = 1 / exchangeRate
    }
    // multiply amount of fiat by amount multiplier to get amount of BCH
    let calculatedAmount = (props.amount * amountMultiplier)
      .toFixed(8)
      .toString()
    // shave off all the exra zeros from the end
    while (calculatedAmount.endsWith('0')) {
      calculatedAmount = calculatedAmount.substr(
        0,
        calculatedAmount.length - 1
      )
    }
    setAmountBCH(calculatedAmount)
    amountBCH = calculatedAmount

    // if no address was given, and a merchantID was given, use the merchantID
    if (!props.address && props.merchantID) {
      try {
        let invoiceResult = await axios.post(props.gatewayServer + '/pay', {
          merchantID: props.merchantID,
          paymentID: props.paymentID,
          callbackURL: props.callbackURL
        })
        if (invoiceResult.data.status === 'error') {
          alert(showError(invoiceResult.data))
          return
        } else {
          setPaymentAddress(invoiceResult.data.paymentAddress)
          paymentAddress = invoiceResult.data.paymentAddress
        }
      } catch (e) {
        alert(
          showError(
            'We\'re having some trouble contacting the Gateway server!'
          )
        )
        return
      }
      // if a direct deposit address was given, use it for payment address
    } else {
      setPaymentAddress(props.address)
      paymentAddress = props.address
    }
    // verify payment address was set either way
    if (!paymentAddress || paymentAddress === 'loading...') {
      alert(showError('We did not find a payment address!'))
    }

    // connect to the webSocket
    // TODO put in own function
    sock = io(props.blockExplorer)
    setSock(sock)
    sock.on('connect', () => {
      sock.emit('subscribe', 'inv')
      console.log('GATEWAY: Connected to block explorer!')
    })
    sock.on('disconnect', () => {
      console.log('GATEWAY: Disconnected from block explorer')
      console.log('GATEWAY: This does not mean that your payment failed')
    })
    sock.on('error', () => {
      console.log('GATEWAY: Disconnected from block explorer')
      console.log('GATEWAY: This does not mean that your payment failed')
    })
    sock.on('tx', handlePayment)

    // finally, open the dialog
    setDialogOpen(true)
  }

  // checks payment destinations to see if they concern this transaction
  let handlePayment = async data => {
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
      if (!props.address) {
        await sendPaymentToServer(data.txid)
      }

      // update the state
      setPaymentComplete(true)

      // play the audio clip if enabled
      if (props.enablePaymentAudio) {
        paymentCompleteAudio.play()
      }

      // close the dialog when completed, if requested
      if (props.closeWhenComplete) {
        handleClose()
      }

      // call the local website callback, if requested
      if (props.paymentCompleteCallback) {
        if (typeof window === 'object') {
          // set the TXID global variable
          window.gatewayPaymentTXID = data.txid
          window.gatewayPaymentAddress = paymentAddress
        }

        // eval the callback from the global scope
        try {
          let globalEval = eval
          globalEval(props.paymentCompleteCallback)
        } catch (e) {
          showError('Error running your local JavaScript callback!')
        }
      }
    }
  }

  // when the dialog box is closed, close the WebSocket
  // TODO componentWillUnpount and all of that lifecycle stuff
  let handleClose = () => {
    sock.close()
    setDialogOpen(false)
  }

  // when we find a matching payment, send it to the server to mark invoice paid
  let sendPaymentToServer = async txid => {
    try {
      let paymentResponse = await axios.post(props.gatewayServer + '/paid', {
        paymentAddress: paymentAddress,
        paymentTXID: txid
      })
      if (paymentResponse.data.status === 'error') {
        showError(paymentResponse.data)
      }
    } catch (e) {
      alert(
        showError(
          'If you sent the funds, your payment has been received. However, Gateway is having trouble getting a receipt for your transaction. If you are concerned this could be a problem, please include this TXID in a support message to Gateway or to your merchant:\n\n' +
            txid
        )
      )
    }
  }

  // render everything
  return (
    <div
      style={{
        display: 'inline-block',
        padding: '0.25em'
      }}
      id={props.elementID}
    >
      <Button
        onClick={handleClick}
        onClose={handleClose}
        variant="contained"
        color="primary"
      >
        {props.buttonText}
      </Button>
      <Dialog
        open={dialogOpen}
        keepMounted
        onClose={handleClose}
        title={paymentComplete ? 'Thank you!' : props.dialogTitle}
      >
        {paymentComplete ? (
          <PaymentComplete />
        ) : (
          <PaymentProgress
            amountBCH={amountBCH}
            paymentAddress={paymentAddress}
            hideWalletButton={props.hideWalletButton}
            hideAddressText={props.hideAddressText}
          />
        )}
      </Dialog>
    </div>
  )
}

PayButton.propTypes = {
  buttonText: PropTypes.string,
  amount: PropTypes.any,
  currency: PropTypes.string,
  dialogTitle: PropTypes.string,
  merchantID: PropTypes.string,
  address: PropTypes.string,
  paymentID: PropTypes.string,
  callbackURL: PropTypes.string,
  elementID: PropTypes.string,
  paymentCompleteAudio: PropTypes.string,
  paymentCompleteCallback: PropTypes.string,
  gatewayServer: PropTypes.string,
  enablePaymentAudio: PropTypes.bool,
  hideWalletButton: PropTypes.bool,
  blockExplorer: PropTypes.string,
  closeWhenComplete: PropTypes.bool,
  hideAddressText: PropTypes.string
}

export default PayButton
