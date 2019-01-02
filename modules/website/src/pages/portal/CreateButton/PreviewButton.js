import React from 'react'
import { Text, Container } from 'components'
import PayButton from '@gatewaycash/paybutton'

export default ({
  merchantID,
  buttonText,
  anyAmount,
  amount,
  currency,
  dialogTitle,
  paymentID,
}) => (
  <Container>
    <h2>Button Preview</h2>
    <Text>
      This is what your finished button will look like and how it will behave.
      Payments made to the button on this page will be sent to your address.
    </Text>
    <center>
      <PayButton
        merchantID={merchantID}
        amount={anyAmount ? '0' : amount}
        currency={currency}
        dialogTitle={dialogTitle}
        paymentID={paymentID}
        buttonText={buttonText}
      />
    </center>
  </Container>
)
