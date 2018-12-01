import React from 'react'
import { Router, Redirect } from '@reach/router'
import * as pages from 'pages'

let NotFound = () => (
  <div>
    <h1>Page not found</h1>
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
