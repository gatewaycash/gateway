import React from 'react'
import { Link } from '@reach/router'
import Button from '@material-ui/core/Button'

export default ({ page }) => (
  <div>
    <center>
      <h1>{page}</h1>
      <Link to="/portal/create">
        <Button
          variant={page === 'Create a Button' && 'contained'}
          color="primary"
        >
          Create Button
        </Button>
      </Link>
      <Link to="/portal/payments">
        <Button
          variant={page === 'View Payments' && 'contained'}
          color="primary"
        >
          View Payments
        </Button>
      </Link>
      <Link to="/portal/settings">
        <Button
          variant={page === 'Settings' && 'contained'}
          color="primary"
        >
          Settings
        </Button>
      </Link>
    </center>
  </div>
)
