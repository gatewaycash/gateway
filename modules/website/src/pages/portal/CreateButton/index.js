import React from 'react'
import NavigationMenu from '../NavigationMenu'
import PaymentIDInfo from './PaymentIDInfo'
import SupportProject from './SupportProject'
import { Footer } from 'components'
import ButtonBuilder from './ButtonBuilder'
import styles from '../../../jss/CreateButtonPage'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'

const CreateButtonPage = ({ classes }) => (
  <React.Fragment>
    <NavigationMenu page="Create a Button" />
    <div className={classes.button_builder_wrap}>
      <ButtonBuilder />
      <div className={classes.content_wrap}>
        <PaymentIDInfo />
        <SupportProject />
      </div>
    </div>
    <Footer />
  </React.Fragment>
)

CreateButtonPage.propTypes = {
  classes: PropTypes.object
}

export default withStyles(styles)(CreateButtonPage)
