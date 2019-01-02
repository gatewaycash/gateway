import React from 'react'
import { Container, Text } from 'components'

export default () => (
  <>
    <Container>
      <h2>More Info About Payment IDs</h2>
      <Text>
        The optional Payment ID property can be used to help you keep track of
        different payments made to your merchant account. For example, if you're
        selling T-shirts and you want to know who has paid for their order, you
        can set a payment ID equal to your order number. Since payment IDs show
        up in the View Payments tab, you'll know which orders have been paid
        for and are ready to ship.
      </Text>
      <Text>
        Needless to say, always make sure an acceptable amount has been paid
        before shipping items or fulfilling orders.
      </Text>
      <Text>
        For more information on callback URLs, deeper PayButton customization,
        integration with other services and more, check out the <a href="/docs">PayButton docs</a>.
      </Text>
    </Container>
    <Container>
      <h2>A Note on How Payments Are Processed</h2>
      <Text>
        The site generates an address for each payment and securely stores the
        key. The moment the customer pays, the Bitcoin Cash network instantly
        validates the payment and within 3 seconds, the customer is done and can
        move on with their day.
      </Text>
      <Text>
        New payments are refreshed once every 30 seconds and forwarded to
        merchants as soon as they are detected. About a tenth of a cent is
        deducted from each payment to pay for the transfer fee, and if you've
        chosen to help support the project from Account Settings (off by
        default), your selected amount will also be deducted as well. All other
        funds go to your payout address. Check out our <a href="https://api.gateway.cash">API docs</a> for more info and customization.
      </Text>
    </Container>
  </>
)
