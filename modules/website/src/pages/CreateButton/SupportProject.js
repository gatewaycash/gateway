import React from 'react'
import Paper from '@material-ui/core/Paper'
import PayButton from '@gateway/PayButton'

export default () => (
  <Paper className="paper">
    <h2>Support the Project</h2>
    <p>
      If you like this project and want to see it get even better for both
      merchants and customers, please consider a donation. Optionally, you can
      also choose to donate a portion of each payment made to your merchant
      account from Settings.
    </p>
    <center>
      <PayButton
        merchantID="ef0fcea08bfa9cb0"
        buttonText="Support gateway.cash"
      />
    </center>
  </Paper>
)
