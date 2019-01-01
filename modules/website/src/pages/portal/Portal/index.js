import React from 'react'
import { navigate } from '@reach/router'
import Footer from './../../../components/Footer'
import Login from './Login'
import Register from './Register'
import Logo from 'components/Logo'
import OnboardingInfo from './OnboardingInfo'

export default () => {
  sessionStorage.gatewayAPIKey && navigate('/portal/dashboard')
  return (
    <>
      <div
        style={{
          width: '100%',
          display: 'inline-block',
          margin: '1em',
        }}
      >
        <Logo size="10" centered />
        <h1 style={{textAlign: 'center'}} >Bitcoin Made Simple</h1>
      </div>
      <Login />
      <Register />
      <OnboardingInfo />
      <Footer />
    </>
  )
}
