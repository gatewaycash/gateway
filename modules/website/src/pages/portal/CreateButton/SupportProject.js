import React from 'react'
import Container from 'components/Container'
import Text from 'components/Text'

export default () => {
  setTimeout(() => {
    window.PayButton && window.PayButton.render(
      'gatewayContribute',
      {
        merchantID: 'ef0fcea08bfa9cb0',
        buttonText: 'Support Gateway.cash'
      }
    )},
    1000
  )
  return (
    <Container>
      <h2>Support the Project</h2>
      <Text>
        If you like this project and want to see it get even better for both
        merchants and customers, please consider a donation. Optionally, you can
        also choose to donate a portion of each payment made to your merchant
        account from Settings.
      </Text>
      <center>
        <div id="gatewayContribute"></div>
      </center>
    </Container>
  )
}
