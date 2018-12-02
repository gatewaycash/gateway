import React from 'react'
import { Router, Redirect } from '@reach/router'
import * as pages from 'pages'

let NotFound = () => (
  <div>
    <center>
      <h1>Page not found</h1>
      <p>
        Check the URL and try again. If you believe this is an error, please
        send an email to support@gateway.cash for assistance.
      </p>
    </center>
  </div>
)

export default () => (
  <Router>
    <Redirect from="/" to="start" noThrow />
    {Object.entries(pages).map(([path, Page]) => (
      <Page key={path} path={path.toLowerCase()} />
    ))}
    <NotFound default />
  </Router>
)
