import React from 'react'
import { Logo, Footer, Container } from 'components'

export default () => (
  <>
    <Logo centered />
    <Container halfWidth>
      <h1>Error 404: Page Not Found</h1>
      <p>
        Check the URL and try again. You might have mistyped a web address or you might be following a broken link. If you believe this is an error, please send an email to <a href="mailto:support@gateway.cash">support@gateway.cash</a> for assistance. Please include your current web address in the email.
      </p>
    </Container>
    <Container halfWidth>
      <h2>Gateway.cash Resources</h2>
      <ul>
        <li><a
          href="/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          PayButton documentation
        </a></li>
        <li><a
          href="https://api.gateway.cash/"
          target="_blank"
          rel="noopener noreferrer"
        >
          API docs
        </a></li>
        <li><a
          href="https://github.com/gatewaycash/gateway"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub repository
        </a></li>
        <li><a
          href="https://ambassador.cash"
          target="_blank"
          rel="noopener noreferrer"
        >
          Developer Discord (#gatewaycash channel)
        </a></li>
        <li><a
          href="mailto:hello@gateway.cash"
          target="_blank"
          rel="noopener noreferrer"
        >
          Send us an email
        </a></li>
      </ul>
    </Container>
    <Footer />
  </>
)
