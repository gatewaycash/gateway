import React from 'react'
import ReactDOM from 'react-dom'
import PayButton from './../paybutton/src/PayButton.js'

// create a local .render() function
window.PayButton = {}
window.PayButton.render = function (elementID, props) {
  ReactDOM.render(
    <PayButton
      buttonText={props.buttonText}
      dialogTitle={props.dialogTitle}
      amount={props.amount}
      currency={props.currency}
      merchantID={props.merchantID}
      paymentID={props.paymentID}
      callbackURL={props.callbackURL}
      address={props.address}
      gatewayServer={props.gatewayServer}
      paymentCompleteAudio={props.paymentCompleteAudio}
      paymentCompleteCallback={props.paymentCompleteCallback}
      closeWhenComplete={props.closeWhenComplete}
      elementID={elementID}
    />,
    document.getElementById(elementID)
  )
}

// on page load, search for and render all payment buttons
window.onload = function() {
  // find all elements with class "payButton"
  var buttons = document.getElementsByClassName('payButton')
  console.log(
    'Gateway: Found',
    buttons.length,
    buttons.length === 1 ? 'PayButton' : 'PayButtons',
    'on this page.'
  )

  // for each of those elements, render the button
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons.item(i)

    // set a random ID for the button so we can keep track of it
    var buttonID = 'pay-' + Math.floor(Math.random() * 100000)
    button.id = buttonID
    button.setAttribute('id', buttonID)

    // send all attributes to the render function
    window.PayButton.render(
      buttonID,
      {
        buttonText: button.getAttribute('buttonText'),
        dialogTitle: button.getAttribute('dialogTitle'),
        amount: button.getAttribute('amount'),
        currency: button.getAttribute('currency'),
        merchantID: button.getAttribute('merchantID'),
        paymentID: button.getAttribute('paymentID'),
        callbackURL: button.getAttribute('callbackURL'),
        address: button.getAttribute('address'),
        gatewayServer: button.getAttribute('gatewayServer'),
        paymentCompleteAudio: button.getAttribute('paymentCompleteAudio'),
        paymentCompleteCallback: button.getAttribute('paymentCompleteCallback'),
        closeWhenComplete: button.getAttribute('closeWhenComplete'),
        elementID: buttonID
      }
    )
  }
}
