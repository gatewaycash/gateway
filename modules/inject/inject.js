import React from 'react'
import ReactDOM from 'react-dom'
import PayButton from '../paybutton/src/PayButton'

// fail when there is no window object
if (typeof window !== 'object') {
  throw {
    message: 'Window must be defined in order to use the Gateway inject script'
  }
}

// create a local .render() function accessible from the window object
window.PayButton = {}
window.PayButton.render = (elementID, props) => {
  // first, we clear anything that might be in the element
  ReactDOM.render(
    <div id={elementID}>Loading...</div>,
    document.getElementById(elementID),
    () => {
      // then, we render the actual PayButton
      ReactDOM.render(
        <PayButton {...props} elementID={elementID} />,
        document.getElementById(elementID)
      )
    }
  )
}

// this function uses the above renderer to load all buttons where
// class="payButton" automatically
let bootstrapPayButtons = () => {
  // query the DOM and console-log however many buttons we found
  let buttons = document.getElementsByClassName('payButton')
  console.log(
    'Gateway: Found',
    buttons.length,
    buttons.length === 1 ? 'PayButton' : 'PayButtons',
    'on this page.'
  )

  // for each of those buttons, use the renderer to display the button
  for (let i = 0; i < buttons.length; i++) {
    let button = buttons.item(i)

    // set a random ID for the button so we can keep track of it
    let buttonID = 'pay-' + Math.floor(Math.random() * 100000)
    button.id = buttonID
    button.setAttribute('id', buttonID)

    // store all element attributes in a JSON object
    let props = {}
    if (button.hasAttributes()) {
      let attrs = button.attributes
      for (let j = 0; j < attrs.length; j++) {
        props[attrs[j].name] = attrs[j].value
      }
    }

    // render the button
    window.PayButton.render(buttonID, props)
  }
}

// on page load, call the automatic button loader defined above
window.addEventListener('load', bootstrapPayButtons)
