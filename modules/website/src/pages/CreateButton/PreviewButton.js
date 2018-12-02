import React from 'react'
import Paper from '@material-ui/core/Paper'
import PayButton from 'gatewaycash-paybutton'

export default ({
  merchantID,
  buttonText,
  anyAmount,
  amount,
  currency,
  dialogTitle,
  paymentID,
}) => (
  <Paper className="paper">
    <h2>Button Preview</h2>
    <p>
      This is what your finished button will look like and how it will behave.
      Payments made to the button on this page will be sent to your address.
    </p>
    <center>
      <PayButton
        merchantID={merchantID}
        amount={anyAmount ? '0' : amount}
        currency={currency}
        dialogTitle={dialogTitle}
        paymentID={paymentID}
      >
        {buttonText}
      </PayButton>
    </center>
  </Paper>
)
