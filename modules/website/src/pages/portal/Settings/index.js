import React from 'react'
import Username from './Username'
import Password from './Password'
import APIInfo from './APIInfo'
import { Container, Footer, Text } from 'components'
import NavigationMenu from './../NavigationMenu'

export default () => (
  <>
    <NavigationMenu page="Your Account" />
    <Username />
    <Password />
    <APIInfo />
    <Container>
      <h2>Display Currency</h2>
      <Text>
        Bitcoin Cash (BCH) units will always be displayed. In places like
        the View Payments page, you can choose to have values converted
        and displayed in other currencies as well. When viewing payments,
        you will be shown the current value as well as what the value was
        at the time the payment was made.
      </Text>
      <p>This feature hasn't been built yet, please check back soon.</p>
    </Container>
    <Container>
      <h2>Supporting the Project</h2>
      <Text>
        If you'd like to support the project, you can choose to donate a
        portion of each payment made to your merchant account. This will
        always be off by default, but any support you're able to provide is
        much appreciated.
      </Text>
      <p>This feature hasn't been built yet, please check back soon.</p>
    </Container>
    <Footer />
  </>
)
