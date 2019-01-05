import React from 'react'
import Done from '@material-ui/icons/Done'

export default () => (
  <center>
    <Done
      style={{
        width: '10em',
        height: '10em'
      }}
    />
    <p
      style={{
        marginLeft: '1em',
        marginRight: '1em'
      }}
    >
      Your payment has been received.
    </p>
  </center>
)
