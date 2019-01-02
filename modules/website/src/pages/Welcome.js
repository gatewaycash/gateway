import React from 'react'
import { Button } from '@material-ui/core'
import { navigate } from '@reach/router'
import { Logo, Container, Footer } from 'components'

export default () => (
  <>
    <center>
      <Logo />
      <h1>Bitcoin Made Simple</h1>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate('portal')}
      >
        GET STARTED
      </Button>
      <br />
      <br />
      <Button
        href="https://www.youtube.com/watch?v=jduVN643Prc"
        target="_blank"
      >
        What is Bitcoin Cash?
      </Button>
    </center>
    <Container>
      <h2>Construction</h2>
      <p>
        Gateway is still being built. If you'd like to help, check out
        our <a href="https://github.com/gatewaycash/gateway">GitHub</a>!
        Portions of our website may not behave as expected or work at all until we bring everything online.
      </p>
      <h3>API Functional</h3>
      <p>
        If you're a developer, you can check out our API documentation. The production-ready API server is up and running, and our payment processing engines have started! See the API docs link at the bottom of this page for more information.
      </p>
    </Container>
    <Container>
      <h2>Making Bitcoin Easy</h2>
      <img
        src='https://is2-ssl.mzstatic.com/image/thumb/Purple128/v4/b6/75/fd/b675fd99-1c2f-4929-6053-349e941e62b0/source/512x512bb.jpg'
        alt="Electron Cash Logo"
        title="Electron Cash Logo"
        style={{
          width: '40%',
          marginLeft: '30%'
        }}
      />
      <p>
        Gateway is making Bitcoin Cash (BCH) easy for merchants and website
        operators across the world. By standardizing the Bitcoin Cash payment
        experience, we can reduce friction and build on top of Bitcoin together.
      </p>
    </Container>
    <Container>
      <h2>What We Do</h2>
      <p>
        Gateway is a free and open-source software project which provides merchants and businesses with the tools they need to make accepting Bitcoin Cash simple and easy.
      </p>
      <p>
        Our trademark PayButton is simplifying the payment experience for websites and apps across the ecosystem. Developers, community leaders and Bitcoin Cash ambassadors are constantly working to make the Gateway payment experience seamless and standard across all Bitcoin Cash applications.
      </p>
    </Container>
    <Container>
      <h2>Doing it Together</h2>
      <p>
        Gateway is an open platform pioneering open standards for the future of
        payments. We want to build a standard, unified and positive experience
        for both customers and merchants who decide that Bitcoin Cash is the
        way forward.
      </p>
    </Container>
    <Container>
      <h2>Doing it for Everyone</h2>
      <p>
        Billions of people across the earth don't have the financial tools they
        need to earn, save and build a life for themselves and their families.
        By making connections with shopkeepers and forging relationships with
        everyday people in third-world countries, we are learning their needs
        and building those tools on top of Bitcoin Cash.
      </p>
    </Container>
    <Container>
      <h2>Useful Links</h2>
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
