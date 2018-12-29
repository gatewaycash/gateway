import React from 'react'
import Button from '@material-ui/core/Button'
import { navigate } from '@reach/router'
import logo from './../res/logo.svg'

export default () => (
  <>
    <center>
      <img
        className="logoImage"
        alt="Gateway Logo"
        src={logo}
      />
      <h1 className="mainHeading">
        Simple Bitcoin Payments
      </h1>
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
    <div className="container">
      <h2>Making Bitcoin Easy</h2>
      <p>
        Gateway is making Bitcoin Cash (BCH) easy for merchants and website
        operators across the world. By standardizing the Bitcoin Cash payment
        experience, we can reduce friction and build on top of Bitcoin together.
      </p>
      <h3>Useful Links</h3>
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
    </div>
    <center>
      <p>
        Copyright &copy 2018 Gateway
      </p>
    </center>
  </>
)
