import React from 'react'
import Paper from '@material-ui/core/Paper'

export default () => (
  <Paper className="paper">
    <h2>Generated Code</h2>
    <p>
      Add this line of HTML once on each page you want to accept payments on:
    </p>
    <pre className="sourceCode">
      {`<script src="https://gateway.cash/pay.js"></script>`}
    </pre>
    <p>
      Add this code wherever you want to place a payment button. You can put as
      many buttons on the same page as you'd like:
    </p>
    <pre className="sourceCode">
      {`
<div
class="payButton"
merchantID="${this.state.merchantID}"
buttonText="${this.state.buttonText}"
dialogTitle="${this.state.dialogTitie}"
paymentID="${this.state.paymentID}"
></div>
`}
    </pre>
    <p>
      Feel free to change any of the values in the above code block except your
      merchant ID, which is how you'll get paid.
    </p>
  </Paper>
)
