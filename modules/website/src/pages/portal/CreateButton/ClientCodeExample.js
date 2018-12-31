import React from 'react'
import Paper from '@material-ui/core/Paper'
import 'style/containers.css'

export default ({
  merchantID,
  buttonText,
  dialogTitle,
  paymentID,
  amount,
  currency,
  callbackURL
}) => (
  <Paper className="paper container">
    <h2>Generated Code</h2>
    <p>
      Add this line of HTML once on each page you want to accept payments on:
    </p>
    <pre className="sourceCode">
      {`<script src="https://gateway.cash/pay.js"></script>`}
    </pre>
    <p>
      Add this code wherever you want to place a payment button. You can put
      as many buttons on the same page as you'd like:
    </p>
    <pre className="sourceCode">
    {/*
      Try to un-spaghettify this, but good luck making it display right again :p
    */}
      {`<div
  class="payButton"
  merchantID="${merchantID}"${buttonText !== 'Donate' ? `
  buttonText="${buttonText}"` : ''}${amount !== '0' ? `
  amount="${amount}"` : ''}${currency !== 'BCH' ? `
  currency="${currency}"` : ''}${dialogTitle !== 'Complete Your Payment' ? `
  dialogTitle="${dialogTitle}"` : ''}${paymentID !== 'donation' ? `
  paymentID="${paymentID}"` : ''}${callbackURL !== 'None' ? `
  callbackURL="${callbackURL}"` : ''}
></div>`}
    </pre>
    <p>
      Feel free to change any of the values in the above code block except
      your merchant ID, which is how you'll get paid.
    </p>
  </Paper>
)
