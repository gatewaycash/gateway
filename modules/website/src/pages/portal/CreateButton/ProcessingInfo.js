import React from 'react'
import { Card, CardContent } from '@material-ui/core'
import { Text } from 'components'

export default () => (
  <Card>
    <CardContent>
      <h2>A Note on How Payments Are Processed</h2>
      <Text>
        The site generates an address for each payment and securely stores the
        key. The moment the customer pays, the Bitcoin Cash network instantly
        validates the payment and within 3 seconds, the customer is done and
        can move on with their day.
      </Text>
      <Text>
        New payments are refreshed once every 30 seconds and forwarded to
        merchants as soon as they are detected. About a tenth of a cent is
        deducted from each payment to pay for the transfer fee, and if you've
        chosen to help support the project from Account Settings (off by
        default), your selected amount will also be deducted as well. All
        other funds go to your payout address. Check out our{' '}
        <a href="https://api.gateway.cash">API docs</a> for more info and
        customization.
      </Text>
    </CardContent>
  </Card>
)
