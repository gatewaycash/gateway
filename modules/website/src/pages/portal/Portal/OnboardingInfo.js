import React from 'react'
import { Card, CardContent } from '@material-ui/core'

export default ({ className }) => (
  <Card className={className}>
    <CardContent>
      <h1>Great Bitcoin Cash Resources for Beginners</h1>
      <p>
        If you're just starting out with Bitcoin Cash, welcome aboard! The
        Bitcoin system is a complicated beast, but there are many helpful
        videos, articles and community resources to help you get an
        understanding of why it's so awesome.
      </p>
      <h2>Wondering How to Get an Address?</h2>
      <p>
        In order to start accepting Bitcoin Cash, you must first create a
        Bitcoin Cash wallet. We recommend using the{' '}
        <a
          href="https://wallet.bitcoin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          bitcoin.com wallet
        </a>
        , a tried-and-true wallet trusted by the community.
      </p>
      <p>
        Other wallets include Electron Cash, available from{' '}
        <a href="https://electroncash.org">here</a>, the{' '}
        <a href="https://badgerwallet.cash/">Badger Wallet</a>, and many others.
      </p>
    </CardContent>
  </Card>
)
