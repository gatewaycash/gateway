import React, { Component } from 'react'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Done from '@material-ui/icons/Done'

import io from 'socket.io-client'

class PayButton extends Component {

  state = {
    dialogOpen: false,
    paymentComplete: false,
    address: 'loading...'
  }
  
	showError = (error) => {
		var errorText = 'We\'re sorry, but an error is preventing you from '
    errorText += 'making your payment. For help, please contact the '
    errorText += 'merchant, or send an email to support@gateway.cash.\n\n'
    errorText += 'The error was:\n\n' + error
    alert(errorText)
    console.error('Payment error', errorText)
	}
  
  updateData = () => {
    // set default value for this.buttonText if not provided
    this.buttonText = this.props.buttonText
    if (this.buttonText === '' || 
        typeof this.buttonText === 'undefined' ||
        this.buttonText === null) {
      this.buttonText = 'Donate'
    }
    // set default value for this.dialogTitle if not provided
    this.dialogTitle = this.props.dialogTitle
    if (this.dialogTitle === '' || 
        typeof this.dialogTitle === 'undefined' ||
        this.dialogTitle === null) {
      this.dialogTitle = 'Complete Your Payment'
    }
    // set default value for this.amount if not provided
    this.amount = this.props.amount
    if (this.amount === '' || 
        typeof this.amount === 'undefined' ||
        this.amount === null ||
        isNaN(this.amount)) {
      this.amount = 0
    } else {
      this.amount = Math.abs(this.amount)
    }
    // set default value for this.currency if not provided
    this.currency = this.props.currency
    if (this.currency === '' || 
        typeof this.currency === 'undefined' ||
        this.currency === null) {
      this.currency = 'BCH'
    } else {
      this.curency = this.currency.toString().substr(0,3).toUpperCase()
    }
    // set default value for this.paymentID if not provided
    this.paymentID = this.props.paymentID
    if (this.paymentID === '' || 
        typeof this.paymentID === 'undefined' ||
        this.paymentID === null) {
      this.paymentID = 'donation'
    } else {
      this.paymentID = this.paymentID.toString().substr(0, 32)
    }
    // Validate merchantID
    this.merchantID = this.props.merchantID
    if (this.merchantID === '' || 
        typeof this.merchantID === 'undefined' ||
        this.merchantID === null) {
      this.merchantID = 'invalid'
      console.error('Gateway: WARNING! No Merchant ID was given to a button!')
    } else if (this.merchantID.toString().length !== 16) {
      console.error('Gateway: WARNING! Invalid Merchant ID given to a button!')
    }
    // set default value for this.callbackURL if not provided
    this.callbackURL = this.props.callbackURL
    if (this.callbackURL === '' || 
        typeof this.callbackURL === 'undefined' ||
        this.callbackURL === null) {
      this.callbackURL = 'None'
    } else {
      if (this.callbackURL.toString().length > 128) {
        console.error('Gateway: CallbackURL too long!')
        console.error('Gateway: Shortening CallbackURL to 128 characters')
        this.callbackURL = this.callbackURL.toString().substr(0, 128)
      }
      if (!this.callbackURL.toString().startsWith('http://') ||
          !this.callbackURL.toString().startsWith('https://')) {
        console.error('Gateway: Invalid callbackURL passed to button!')
        this.callbackURL = 'None'
      }
    }
  }
  
  handleClick = () => {
  	if (this.state.paymentComplete) {
  		this.setState({dialogOpen: true})
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
      			this.showError(response)
     			} else {
     				console.log('Gateway: Pay to adress', response)
     				this.QRCodeURL = 'https://chart.googleapis.com/'
     				this.QRCodeURL += 'chart?chs=300x300&cht=qr&chl='
            this.QRCodeURL += response + '?label=Payment'
            this.walletURL = response + '?label=Payment'
            if (this.amount > 0) {
    	        this.QRCodeURL += '&amount=' + this.amount
    	        this.walletURL += '&amount=' + this.amount
            }
            this.setState({address: response, dialogOpen: true})
      			// TODO change to rest.bitcoin.com
      		 	this.sock = io('wss://bitcoincash.blockexplorer.com')
      		 	this.sock.on('connect', () => {
        		  this.sock.emit('subscribe', 'inv')
     	  		})
     	  		this.sock.on('disconnect', () => {
     	  		  console.log('Gateway: Payment server disconnected')
      		    console.log('Gateway: This does not mean that your payment failed')
      		  })
      		 	this.sock.on('error', () => {
      		   	console.error('Gateway: Error listening for payments')
        	  	console.log('Gateway: This does not mean that your payment failed')
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

  handleClose = () => {
    this.sock.close()
    if (this.state.paymentComplete === false) {
    	console.log('Gateway: Payment canceled')
    }
    this.setState({dialogOpen: false})
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
  
  renderDialog = () => {
    return this.state.paymentComplete ? (
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
    ) : (
      <Dialog
        open={this.state.dialogOpen}
        keepMounted
        onClose={this.handleClose}
      >
        <DialogTitle>
          <center>
            {this.dialogTitle}
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
                Send {this.amount == 0 ? 'some' : this.props.amount} Bitcoin
                Cash (BCH) to this address to complete your payment
              </p>
              <img
                src={this.QRCodeURL}
                alt="Payment QR code"
                style={{
                  width:'15em',
                  margin:'auto',
                  marginTop:'-1em',
                  marginBottom:'-1.5em',
                  align:'center'
                }}
              />
              <p
                style={{
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
                href={this.walletURL}
              >
                OPEN WALLET
              </Button>
            </center>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    )
  }
  
  render () {
    updateData()
    return (
      <div style={{display: 'inline-block', padding: '0.25em'}}>
        <Button
          onClick={this.handleClick}
          variant="contained"
          color="primary"
        >
          {this.buttonText}
        </Button>
        {this.renderDialog()}
      </div>
    )
  }
}

export default PayButton
