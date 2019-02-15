import React, { useState } from 'react'
import {
  FormControlLabel,
  TextField,
  Checkbox,
  Card,
  CardContent,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Fab
} from '@material-ui/core'
import { merchantid } from 'API'
import withStyles from '@material-ui/core/styles/withStyles'
import styles from './style'
import PropTypes from 'prop-types'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const ButtonBuilder = ({ buttonProperties, setButtonProperties, classes }) => {
  const [anyAmount, setAnyAmount] = useState(true)
  const [advandedOptions, setAdvancedOptions] = useState(false)

  if (!buttonProperties.merchantID) {
    merchantid().then(response => {
      if (response.status === 'success') {
        setButtonProperties({ merchantID: response.merchantID })
      }
    })
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
        <ExpansionPanel
          className={classes.amount_controls}
          expanded={!anyAmount}
        >
          <ExpansionPanelSummary
            className={classes.any_amount_checkbox}
            classes={{
              root: classes.expansion_summary_root,
              content: classes.expansion_summary_content__currency
            }}
          >
            <FormControlLabel
              onChange={e => {
                setAnyAmount(e.target.checked)
                e.target.checked && setButtonProperties({ amount: '0' })
              }}
              control={<Checkbox checked={anyAmount} color="primary" />}
              label="Allow any amount"
            />
          </ExpansionPanelSummary>
          <ExpansionPanelDetails
            classes={{ root: classes.amount_controls_inner }}
          >
            <TextField
              onChange={e => setButtonProperties({ amount: e.target.value })}
              label="Payment Amount"
              helperText={`Amount in ${buttonProperties.currency}`}
              type="number"
              value={buttonProperties.amount}
              className={classes.amount}
            />
            <FormControl className={classes.currency}>
              <Select
                value={buttonProperties.currency}
                onChange={e =>
                  setButtonProperties({ currency: e.target.value })
                }
                inputProps={{
                  id: 'currency-select'
                }}
              >
                <MenuItem value="BCH">BCH</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="CNY">CNY</MenuItem>
                <MenuItem value="JPY">JPY</MenuItem>
              </Select>
              <FormHelperText>Currency</FormHelperText>
            </FormControl>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <p>
          If you're looking for more advanced functionality, you can further
          customize your button with some additional tweaks.
        </p>
        <ExpansionPanel
          classes={{ root: classes.expansion_root }}
          expanded={advandedOptions}
          onChange={(ev, ex) => setAdvancedOptions(ex)}
        >
          <ExpansionPanelSummary
            classes={{
              root: classes.expansion_summary_root__reverse,
              content: classes.expansion_summary_content
            }}
          >
            <Fab color="primary">
              <ExpandMoreIcon
                className={
                  advandedOptions
                    ? classes.expand_icon__expanded
                    : classes.expand_icon
                }
              />
            </Fab>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails
            classes={{ root: classes.expansion_details_root }}
          >
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
              className={classes.dialog_title}
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
              onChange={e =>
                setButtonProperties({
                  callbackURL: e.target.value
                })
              }
              label="Callback URL"
              helperText="We'll notify this URL when a payment is made (see below)"
              maxLength={64}
              value={buttonProperties.callbackURL}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
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
