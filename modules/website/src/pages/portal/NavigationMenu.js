import React from 'react'
import { Link, navigate } from '@reach/router'
import Button from '@material-ui/core/Button'

export default ({ page }) => (
  <center>
    <h1>{page}</h1>
      <Button
        variant={page === 'Dashboard' && 'contained'}
        color="primary"
        onClick={() => navigate('portal')}
      >
        Dashboard
      </Button>
      <Button
        variant={page === 'Create a Button' && 'contained'}
        color="primary"
        onClick={() => navigate('portal/create')}
      >
        Create Button
      </Button>
      <Button
        variant={page === 'Payments' && 'contained'}
        color="primary"
        onClick={() => navigate('portal/payments')}
      >
        Payments
      </Button>
      <Button
        variant={page === 'Your Account' && 'contained'}
        color="primary"
        onClick={() => navigate('portal/settings')}
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
