import React from 'react'
import Container from 'components/Container'
import Text from 'components/Text'

/*

  TODO:
  This is broken and a hack is used to make it work.
  We need to find out why the React component is failing.
  We need to remove the <script> tag from the modules/website/public/index.html
  file so that we don't rely on compiled code.

*/

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
