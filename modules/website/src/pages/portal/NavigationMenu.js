import React from 'react'
import { navigate } from '@reach/router'
import { Button } from '@material-ui/core'

export default ({ page }) => (
  <center>
    <h1>{page}</h1>
    <Button
      variant={page === 'Dashboard' ? 'contained' : 'text'}
      color="primary"
      onClick={() => navigate('/portal')}
    >
        Dashboard
    </Button>
    <Button
      variant={page === 'Create a Button' ? 'contained' : 'text'}
      color="primary"
      onClick={() => navigate('/portal/create')}
    >
        Create Button
    </Button>
    <Button
      variant={page === 'Your Payments' ? 'contained' : 'text'}
      color="primary"
      onClick={() => navigate('/portal/payments')}
    >
        Payments
    </Button>
    <Button
      variant={page === 'Your Account' ? 'contained' : 'text'}
      color="primary"
      onClick={() => navigate('/portal/settings')}
    >
        Account
    </Button>
    <Button
      color="secondary"
      onClick={() => {
        delete window.sessionStorage.gatewayAPIKey
        navigate('/')
      }}
    >
        Log Out
    </Button>
  </center>
)
