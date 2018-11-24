import React from 'react'
import Paper from '@material-ui/core/Paper'
import PayButton from '@gateway/PayButton'

export default ({ merchantID, buttonText }) => (
  <Paper className="paper">
    <h2>Button Preview</h2>
    <p>
      This is what your finished button will look like and how it will behave.
      Payments made to the button on this page will be sent to your address.
    </p>
    <center>
      <PayButton
        merchantID={this.state.merchantID}
        amount={this.state.anyAmount ? '0' : this.state.amount}
        currency={this.state.currency}
        dialogTitle={this.state.dialogTitle}
        paymentID={this.state.paymentID}
      >
        {buttonText}
      </PayButton>
    </center>
  </Paper>
)
