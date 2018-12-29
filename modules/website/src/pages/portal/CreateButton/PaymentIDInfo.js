import React from 'react'
import Paper from '@material-ui/core/Paper'

export default () => (
  <>
    <Paper className="paper">
      <h2>More Info About Payment IDs</h2>
      <p>
        The optional Payment ID property can be used to help you keep track of
        different payments made to your merchant account. For example, if you're
        selling T-shirts and you want to know who has paid for their order, you
        can set a payment ID equal to your order number. Since payment IDs show
        up in the View Payments page, you'll know which orders have been paid
        for and are ready to ship.
      </p>
    </Paper>
    <Paper className="paper">
      <h2>A Note on How Payments Are Processed</h2>
      <p>
        The site generates an address for each payment and securely stores the
        key. The moment the customer pays, the Bitcoin Cash network instantly
        validates the payment and within 3 seconds, the customer is done and can
        move on with their day.
      </p>
      <p>
        New payments are refreshed once every 10 minutes and forwarded to
        merchants as soon as they are detected. About a tenth of a cent is
        deducted from each payment to pay for the transfer fee, and if you've
        chosen to help support the project (off by default), your selected
        amount will also be deducted as well. All other funds go to your
        address.
      </p>
    </Paper>
  </>
)
