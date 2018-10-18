import React, { Component } from 'react'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Done from '@material-ui/icons/Done'

import io from 'socket.io-client'

class PayButton extends Component {

  constructor (props) {
    super(props)
    this.state = {
      dialogOpen: false,
      paymentComplete: false,
      address: 'loading...'
    }
  }

	showError = (error) => {
		var errorText = 'We\'re sorry, but an error is preventing you from '
    errorText += 'making your payment. For help, please contact the '
    errorText += 'merchant, or send an email to support@gateway.cash.\n\n'
    errorText += 'The error was:\n\n' + error
    alert(errorText)
    console.error('Payment error', errorText)
	}

  handleClick = () => {
  	console.log('Gateway: Creating payment request')
    var requestURL = 'https://gateway.cash/api/pay?merchantID='
    requestURL += this.props.merchantID + '&paymentID=' + this.props.paymentID
    var xhr = new XMLHttpRequest()
    xhr.open('GET', requestURL)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onload = () => {
      if (xhr.readyState === 4) {
      	var response = xhr.responseText.toString()
      	if (!response.startsWith('bitcoincash:')) {
      		this.showError(response)
      	} else {
      		console.log('Gateway: Pay to adress', response)
      		this.setState({address: response, dialogOpen: true})
      		// TODO change to rest.bitcoin.com
        	this.sock = io('wss://bitcoincash.blockexplorer.com')
        	this.sock.on('connect', () => {
        	  this.sock.emit('subscribe', 'inv')
        	})
        	this.sock.on('disconnect', () => {
        	  console.log('Gateway: Payment server disconnected')
          	console.log('Gateway: This does not mean that your payment failed')
          	this.setState({dialogOpen: false})
        	})
        	this.sock.on('error', () => {
          	console.error('Gateway: Error listening for payments')
          	console.log('Gateway: This does not mean that your payment failed')
          	this.setState({dialogOpen: false})
        	})
        	this.sock.on('tx', (data) => {
          	this.handlePayment(data)
        	})
      	}
      }
    }
    xhr.send()
  }

  handleClose = () => {
    this.sock.close()
    var newState = {}
    newState.dialogOpen = false
    if (this.state.paymentComplete) {
    	newState.paymentComplete = false
    } else {
    	console.log('Gateway: Payment canceled')
    }
    this.setState(newState)
  }

  handlePayment = (data) => {
    var valid = false
    for (var i = 0, l = data.vout.length; i < l; i++) {
      var obj = Object.getOwnPropertyNames(data.vout[i])
      for (var j = 0; j < obj.length; j++){
        if (obj[j] === this.state.address) {
          valid = true
        }
      }
    }
    if (valid) {
      this.setState({paymentComplete: true})
      new Audio('https://gateway.cash/audio/ding.mp3').play()
      console.log('Gateway: Payment sent to address')
      console.log('Gateway: Payment TXID:', data.txid)
      this.sendPaymentToServer(data.txid)
    }
  }

  sendPaymentToServer (txid) {
    var requestURL = 'https://gateway.cash/api/paymentsent'
    requestURL += '?txid=' + txid
    requestURL += '&address=' + this.state.address
    var xhr = new XMLHttpRequest()
    xhr.open('GET', requestURL)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log('Gateway: Payment received by server')
        console.log('Gateway: Server response was', xhr.responseText)
      } else {
        console.error('Gateway: Server sent status code', xhr.status)
        console.error('Gateway: Payment will still reach merchant')
      }
    }
    xhr.send()
  }

  render () {
    var dialog = <Dialog></Dialog>
    if (this.state.paymentComplete === false) {
      dialog = (
        <Dialog
          open={this.state.dialogOpen}
          keepMounted
          onClose={this.handleClose}
        >
          <DialogTitle>
          <center>
            {this.props.dialogTitle}
          </center>
          </DialogTitle>
          <DialogContent>
          <DialogContentText>
            <center>
            <p
              style={{
                marginLeft:'0.5em',
                marginRight:'0.5em',
                marginTop:'-1.5em',
              }}
            >
              Send {this.props.amount <= 0 ? 'some' : this.props.amount}
              Bitcoin Cash (BCH) to this address to complete your payment
            </p>
            <img
              src={"https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=" + this.state.address + this.props.amount <= 0 ? '' : '?amount=' + this.props.amount}
              alt="Payment QR code"
              style={{
                width:'15em',
                margin:'auto',
                marginTop:'-1em',
                marginBottom:'-1.5em',
                align:'center'
              }}
            />
            <p style={{
                width:'17em',
                fontFamily:'monospace',
                fontSize:'0.8em',
                lineHeight:'100%',
                wordWrap:'break-word'
              }}
            >
              {this.state.address}
            </p>
            <Button
              variant="contained"
              color="primary"
              href={this.state.address + '?amount=' + this.props.amount} >
              OPEN WALLET
            </Button>
            </center>
          </DialogContentText>
          </DialogContent>
        </Dialog>
      )
    } else { // payment has been completed
      dialog = (
        <Dialog
          open={this.state.dialogOpen}
          keepMounted
          onClose={this.handleClose}
        >
          <DialogTitle>
            <center>
              Thank You!
            </center>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <center>
                <Done
                  style={{
                    width:'10em',
                    height:'10em'
                  }}
                />
                <p
                  style={{
                    marginLeft:'1em',
                    marginRight:'1em'
                  }}
                >
                  Your payment has been received.
                </p>
              </center>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )
    }
    return (
      <div style={{display: 'inline-block', padding: '0.25em'}}>
        <Button
          onClick={this.handleClick}
          variant="contained"
          color="primary"
        >
          {this.props.buttonText}
        </Button>
        {dialog}
      </div>
    )
  }
}

export default PayButton
