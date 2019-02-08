import React, { useState } from 'react'
import NavigationMenu from '../NavigationMenu'
import { Footer } from 'components'

import PaymentIDInfo from './PaymentIDInfo'
import SupportProject from './SupportProject'
import PreviewButton from './PreviewButton'
import ProcessingInfo from './ProcessingInfo'
import ClientCodeExample from './ClientCodeExample'
import ButtonBuilder from './ButtonBuilder'

import styles from 'jss/CreateButtonPage'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'

const CreateButtonPage = ({ classes }) => {
  let [buttonProperties, setButtonProperties] = useState({
    buttonText: 'Pay With Bitcoin Cash',
    dialogTitle: 'Complete Your Payment',
    amount: '0',
    currency: 'BCH',
    paymentID: '',
    callbackURL: ''
  })

  let handleButtonPropertiesUpdate = newValue => {
    setButtonProperties({...buttonProperties, ...newValue})
  }

  return (
    <React.Fragment>
      <NavigationMenu page="Create Button" />
      <div className={classes.content_wrap}>
        <ButtonBuilder
          buttonProperties={buttonProperties}
          setButtonProperties={handleButtonPropertiesUpdate}
        />
        <ClientCodeExample buttonProperties={buttonProperties} />
        <PreviewButton buttonProperties={buttonProperties} />
        <PaymentIDInfo />
        <ProcessingInfo />
        <SupportProject />
      </div>
      <Footer />
    </React.Fragment>
  )
}

CreateButtonPage.propTypes = {
  classes: PropTypes.object
}

export default withStyles(styles)(CreateButtonPage)
