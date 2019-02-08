import React from 'react'
import { Text } from 'components'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

export default () => (
  <Card>
    <CardContent>
      <h2>More Info About Payment IDs</h2>
      <Text>
        The optional Payment ID property can be used to help you keep track of
        different payments made to your merchant account. For example, if
        you're selling T-shirts and you want to know who has paid for their
        order, you can set a payment ID equal to your order number. Since
        payment IDs show up in the View Payments tab, you'll know which orders
        have been paid for and are ready to ship.
      </Text>
      <Text>
        Needless to say, always make sure an acceptable amount has been paid
        before shipping items or fulfilling orders.
      </Text>
      <Text>
        For more information on callback URLs, deeper PayButton customization,
        integration with other services and more, check out the{' '}
        <a href="/docs">PayButton docs</a>.
      </Text>
    </CardContent>
  </Card>
)
