import React from 'react'
import { Text, Container } from 'components'
import PayButton from '@gatewaycash/paybutton'

export default props => (
  <Container>
    <h2>Button Preview</h2>
    <Text>
      This is what your finished button will look like and how it will behave.
      Payments made to the button on this page will be sent to your address.
    </Text>
    <center>
      <PayButton {...props} />
    </center>
  </Container>
)
