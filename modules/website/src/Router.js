import React from 'react'
import { Router } from '@reach/router'
import * as pages from 'pages'

let NotFound = () => (
  <div>
    <center>
      <h1>Page not found</h1>
      <p>
        Check the URL and try again. If you believe this is an error, please
        send an email to support@gateway.cash for assistance. Please include
        your current web address in the email.
      </p>
    </center>
  </div>
)

export default () => (
  <Router>
    <pages.Start path="/" />
    <pages.Identification path="/identification" />
    <pages.Login path="/login" />
    <NotFound default />
  </Router>
)
