import React, { useState } from 'react'
import {
  FormControlLabel,
  TextField,
  Checkbox,
  Button,
  Card,
  CardContent
} from '@material-ui/core'
import { merchantid } from 'API'
import withStyles from '@material-ui/core/styles/withStyles'
import styles from './style'
import PropTypes from 'prop-types'

const ButtonBuilder = ({ buttonProperties, setButtonProperties, classes }) => {
  const [merchantID, setMerchantID] = useState(null)
  const [advanced, setAdvanced] = useState(false)
  const [anyAmount, setAnyAmount] = useState(true)

  if (!merchantID) {
    merchantid().then(response => {
      if (response.status === 'success') {
        setMerchantID(response.merchantID)
        setButtonProperties({merchantID: response.merchantID})
      }
    })
  }

  const toggleAdvanced = () => {
    setAdvanced(!advanced)
  }

  return (
    <Card>
      <CardContent>
        <h2>Customize Your Button</h2>
        <p>
          Use the settings below to change various aspects of your payment
          button. Once you're satisfied with the result, scroll down and copy
          the generated code onto any website where you'd like to accept
          payments.
        </p>
        <TextField
          style={{
            width: '100%'
          }}
          onChange={e => {
            setButtonProperties({
              buttonText: e.target.value.substr(0, 25)
            })
          }}
          label="Button Text"
          helperText="Give your payment button a label"
          value={buttonProperties.buttonText}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={anyAmount}
              onChange={e => {
                setAnyAmount(e.target.checked)
                e.target.checked && setButtonProperties({amount: '0'})
              }}
              color="primary"
            />
          }
          label="Allow any amount"
        />
        {!anyAmount && (
          <div className={classes.amount_controls}>
            <TextField
              onChange={e => setButtonProperties({amount: e.target.value})}
              label="Payment Amount"
              helperText={'Amount (' + buttonProperties.currency + ')'}
              type="number"
              value={buttonProperties.amount}
            />
            <TextField
              onChange={e => {
                setButtonProperties({
                  currency: e.target.value.toUpperCase().substr(0, 3)
                })
              }}
              label="Currency"
              helperText="BCH, USD, EUR..."
              maxLength={3}
              value={buttonProperties.currency}
            />
          </div>
        )}
        {advanced ? (
          <div>
            <TextField
              style={{
                width: '100%'
              }}
              onChange={e => {
                setButtonProperties({
                  dialogTitle: e.target.value.substr(0, 50)
                })
              }}
              label="Dialog Title"
              helperText="Title for payment dialog box"
              maxLength={25}
              value={buttonProperties.dialogTitle}
            />
            <TextField
              style={{
                width: '100%'
              }}
              onChange={e => {
                setButtonProperties({
                  paymentID: e.target.value.substr(0, 32)
                })
              }}
              label="Payment ID"
              helperText="Unique ID for payments sent to this button (see below)"
              maxLength={32}
              value={buttonProperties.paymentID}
            />
            <TextField
              style={{
                width: '100%'
              }}
              onChange={e => setButtonProperties({
                callbackURL: e.target.value
              })}
              label="Callback URL"
              helperText="We'll notify this URL when a payment is made (see below)"
              maxLength={64}
              value={buttonProperties.callbackURL}
            />
          </div>
        ) : (
          <div>
            <p>
              If you're looking for more advanced functionality, you can
              further customize your button with some additional tweaks.
            </p>
            <center>
              <Button color="primary" onClick={toggleAdvanced}>
                Advanced Options
              </Button>
            </center>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

ButtonBuilder.propTypes = {
  classes: PropTypes.object,
  buttonProperties: PropTypes.object,
  setButtonProperties: PropTypes.any
}

export default withStyles(styles)(ButtonBuilder)
