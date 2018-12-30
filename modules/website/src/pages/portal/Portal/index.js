import React from 'react'
import { navigate } from '@reach/router'
import Footer from './../../../components/Footer'
import Login from './Login'
import Register from './Register'

export default () => {
  sessionStorage.gatewayAPIKey && navigate('/portal/dashboard')
  return (
    <>
      <Login />
      <Register />
      <Footer />
    </>
  )
}
