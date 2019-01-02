import React from 'react'
import { Logo, Footer, Container } from 'components'

export default () => (
  <>
    <Logo centered />
    <Container>
      <h1>Error 404: Page Not Found</h1>
      <p>
        Check the URL and try again. You might have mistyped a web address or you might be following a broken link. If you believe this is an error, please send an email to <a href="mailto:support@gateway.cash">support@gateway.cash</a> for assistance. Please include your current web address in the email.
      </p>
    </Container>
    <Container>
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
    <Container centered>
      <img
        src="https://res.cloudinary.com/hellofresh/image/upload/f_auto,fl_lossy,q_auto,w_640/v1/hellofresh_s3/image/554a3abff8b25e1d268b456d.png"
        alt="A Random Potato"
        title="A Random Potato"
        poster="A Random Potato"
        style={{
          width: '50%',
          align: 'center'
        }}
      />
    </Container>
    <Footer />
  </>
)
