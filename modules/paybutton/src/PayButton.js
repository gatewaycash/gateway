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
  let paymentCompleteAudio = props.enablePaymentAudio ?
    new Audio(props.paymentCompleteAudio) :
    undefined

  // When the payment button is clicked, generate a new invoice
  let handleClick = async () => {

    // do nothing if the button is disabled
    if (props.disabled) {
      return
    }

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
      let marketData = await fetch(marketDataURL)
      marketData = await marketData.json()
      let exchangeRate = marketData.averages.day
      if (props.consoleOutput !== 'none') {
        console.log(
          'GATEWAY: Current',
          'BCH/' + props.currency,
          'exchange rate:',
          exchangeRate
        )
      }
      amountMultiplier = 1 / exchangeRate
    }
    // multiply amount of fiat by amount multiplier to get amount of BCH
    let calculatedAmount = (props.amount * amountMultiplier)
      .toFixed(8)
      .toString()
    // shave off all the exra zeros from the end
    while (calculatedAmount.endsWith('0')) {
      calculatedAmount = calculatedAmount.substr(0, calculatedAmount.length - 1)
    }
    setAmountBCH(calculatedAmount)
    amountBCH = calculatedAmount

    // if no address was given, and a merchantID was given, use the merchantID
    if (!props.address && props.merchantID) {
      try {
        let invoiceResult = await fetch(
          props.gatewayServer + '/v2/pay', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              merchantID: props.merchantID,
              paymentID: props.paymentID,
              callbackURL: props.callbackURL,
              invoiceAmount: amountBCH
            })
          }
        )
        invoiceResult = await invoiceResult.json()
        if (invoiceResult.status === 'error') {
          alert(showError(invoiceResult))
          return
        } else {
          setPaymentAddress(invoiceResult.paymentAddress)
          paymentAddress = invoiceResult.paymentAddress
        }
      } catch (e) {
        console.error(e)
        alert(
          showError('We\'re having some trouble contacting the Gateway server!')
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

    // open Badger Wallet if installed in the browser
    let useBadger = true
    if (typeof window.web4bch !== 'undefined' && !web4bch.bch.defaultAccount) {
      useBadger = window.confirm(
        'Press OK and unlock your Badger Wallet with your password, then click the button again. Press Cancel to use a QR code instead.'
      )
      if (useBadger === true) return
    }
    if (typeof window.web4bch !== 'undefined' && useBadger) {
      window.web4bch = new window.Web4Bch(window.web4bch.currentProvider)
      var txParams = {
        to: paymentAddress,
        from: web4bch.bch.defaultAccount,
        value: amountBCH > 0 ? amountBCH : 1000
      }
      window.web4bch.bch.sendTransaction(txParams, async (err, res) => {
        if (err) return
        // send payment to Gateway server if it was not direct deposit
        if (!props.address) {
          await sendPaymentToServer(res)
        }

        // update the state
        setPaymentComplete(true)

        // play the audio clip if enabled
        if (props.enablePaymentAudio) {
          paymentCompleteAudio.play()
        }

        // close the dialog when completed, if requested
        if (props.closeWhenComplete) {
          setDialogOpen(false)
        } else {
          // re-open a closed dialog to show the "Thank You" message
          setDialogOpen(true)
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
      })

    // open the dialog box if Badger wasn't opened
    } else {
      setDialogOpen(true)
      // connect to the webSocket
      // TODO put in own function
      sock = io(props.blockExplorer)
      setSock(sock)
      sock.on('connect', () => {
        sock.emit('subscribe', 'inv')
        if (props.consoleOutput !== 'none') {
          console.log('GATEWAY: Connected to block explorer')
        }
      })
      sock.on('disconnect', () => {
        if (props.consoleOutput !== 'none') {
          console.log('GATEWAY: Disconnected from block explorer')
          console.log('GATEWAY: This does not mean that your payment failed')
        }
      })
      sock.on('error', () => {
        if (props.consoleOutput !== 'none') {
          console.log('GATEWAY: Disconnected from block explorer')
          console.log('GATEWAY: This does not mean that your payment failed')
        }
      })
      sock.on('tx', handlePayment)
    }
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
        setDialogOpen(false)
      } else {
        // re-open a closed dialog to show the "Thank You" message
        setDialogOpen(true)
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
    if (props.consoleOutput !== 'none') {
      console.log('GATEWAY: Dialog closed, WebSocket still opened.')
    }
    setDialogOpen(false)
  }

  // when we find a matching payment, send it to the server to mark invoice paid
  let sendPaymentToServer = async txid => {
    try {
      let paymentResponse = await fetch(
        props.gatewayServer + '/v2/paid', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            paymentAddress: paymentAddress,
            paymentTXID: txid
          })
        }
      )
      paymentResponse = await paymentResponse.json()
      if (paymentResponse.status === 'error') {
        showError(paymentResponse)
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
        onClose={handleClose}
        title={paymentComplete ? 'Thank you!' : props.dialogTitle}
        closeDialog={() => setDialogOpen(false)}
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
  hideAddressText: PropTypes.string,
  consoleOutput: PropTypes.string,
  disabled: PropTypes.string
}

export default PayButton
