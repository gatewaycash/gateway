import React from 'react'
import PayButton from '@gatewaycash/paybutton'
import { Card, CardContent } from '@material-ui/core'

export default () => (
  <Card>
    <CardContent>
      <h2>Support the Project</h2>
      <p>
        If you like this project and want to see it get even better for both
        merchants and customers, please consider a donation. Optionally, you can
        also choose to donate a portion of each payment made to your merchant
        account from Settings.
      </p>
      <center>
        <PayButton
          address="bitcoincash:pz3txlyql9vc08px98v69a7700g6aecj5gc0q3xhng"
          buttonText="Support Gateway.cash"
        />
      </center>
    </CardContent>
  </Card>
)
