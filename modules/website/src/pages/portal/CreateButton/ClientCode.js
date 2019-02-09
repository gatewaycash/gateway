import React from 'react'
import { SourceCode } from 'components'
import { Card, CardContent } from '@material-ui/core'
import PropTypes from 'prop-types'

const ClientCode = ({ buttonProperties }) => {

  let generatedCode = `<div
  class="payButton"
  merchantID="${buttonProperties.merchantID}"`

  if (
    buttonProperties.buttonText.toString().toLowerCase() !== 'pay with bitcoin cash'
  ) {
    generatedCode += `\n  buttonText="${buttonProperties.buttonText}"`
  }

  if (buttonProperties.amount !== '' && buttonProperties.amount !== 0) {
    generatedCode += `\n  amount="${buttonProperties.amount}"`

    if (buttonProperties.currency !== 'BCH') {
      generatedCode += `\n  currency="${buttonProperties.currency}"`
    }
  }

  if (
    buttonProperties.dialogTitle.toString().toLowerCase() !== 'complete your payment'
  ) {
    generatedCode += `\n  dialogTitle="${buttonProperties.dialogTitle}"`
  }

  if (buttonProperties.paymentID !== '') {
    generatedCode += `\n  paymentID="${buttonProperties.paymentID}"`
  }

  if (buttonProperties.callbackURL !== '') {
    generatedCode += `\n  callbackURL="${buttonProperties.callbackURL}"`
  }

  generatedCode += '\n></div>'

  return (
    <Card>
      <CardContent>
        <h2>Generated Code</h2>
        <p>
          Add this line of HTML once on each page you want to accept payments on:
        </p>
        <SourceCode>
          {`<script
  src="https://gateway.cash/pay.js"
></script>`}
        </SourceCode>
        <p>
          Add this code wherever you want to place a payment button. You can put
          as many buttons on the same page as you'd like:
        </p>
        <SourceCode>{generatedCode}</SourceCode>
        <p>
          Feel free to change any of the values in the above code block except
          your merchant ID, which is how you'll get paid.
        </p>
      </CardContent>
    </Card>
  )
}

ClientCode.propTypes = {
  buttonProperties: PropTypes.object
}

export default ClientCode
