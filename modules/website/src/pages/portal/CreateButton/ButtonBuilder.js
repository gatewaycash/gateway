import React, { useState } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { Text } from 'components'
import { FormControlLabel, TextField, Switch, Button } from '@material-ui/core'
import PreviewButton from './PreviewButton'
import ClientCodeExample from './ClientCodeExample'
import { merchantid } from 'API'
import withStyles from '@material-ui/core/styles/withStyles'
import styles from '../../../jss/ButtonBuilder'

const ButtonBuilder = ({ classes }) => {
  const [merchantID, setMerchantID] = useState(null)
  const [paymentID, setPaymentID] = useState(null)
  const [buttonText, setButtonText] = useState('Pay With Bitcoin Cash')
  const [dialogTitle, setDialogTitle] = useState('Complete Your Payment')
  const [currency, setCurrency] = useState('BCH')
  const [amount, setAmount] = useState(null)
  const [advanced, setAdvanced] = useState(false)
  const [anyAmount, setAnyAmount] = useState(true)
  const [callbackURL, setCallbackURL] = useState(null)
  const [rawButtonHtml, setRawButtonHtml] = useState('')

  if (!merchantID) {
    merchantid().then(response => {
      if (response.status === 'success') {
        setMerchantID(response.merchantID)
      }
    })
  }

  const toggleAdvanced = () => {
    setAdvanced(!advanced)
  }
  return (
    <div className={classes.builder_wrap}>
      <Card>
        <CardContent>
          <h2>Customize Your Button</h2>
          <Text>
            Use the settings below to change various aspects of your payment
            button. Once you're satisfied with the result, scroll down and copy
            the generated code onto any website where you'd like to accept
            payments.
          </Text>
          <TextField
            style={{
              width: '100%'
            }}
            onChange={e => {
              setButtonText(e.target.value.substr(0, 25))
            }}
            label="Button Text"
            helperText="Give your payment button a label"
            value={buttonText}
          />
          <FormControlLabel
            control={
              <Switch
                checked={anyAmount}
                onChange={e => {
                  setAnyAmount(e.target.checked)
                  e.target.checked && setAmount(null)
                }}
                color="primary"
              />
            }
            label="Allow any amount"
          />
          {!anyAmount && (
            <div className={classes.amount_controls}>
              <TextField
                onChange={e => setAmount(e.target.value)}
                label="Payment Amount"
                helperText={'Amount (' + currency + ')'}
                type="number"
                value={amount}
              />
              <TextField
                onChange={e => {
                  setCurrency(e.target.value.toUpperCase().substr(0, 3))
                }}
                label="Currency"
                helperText="BCH, USD, EUR..."
                maxLength={3}
                value={currency}
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
                  setDialogTitle(e.target.value.substr(0, 50))
                }}
                label="Dialog Title"
                helperText="Title for payment dialog box"
                maxLength={25}
                value={dialogTitle}
              />
              <TextField
                style={{
                  width: '100%'
                }}
                onChange={e => {
                  setPaymentID(e.target.value.substr(0, 32))
                }}
                label="Payment ID"
                helperText="Unique ID for payments sent to this button (see below)"
                maxLength={32}
                value={paymentID}
              />
              <TextField
                style={{
                  width: '100%'
                }}
                onChange={e => setCallbackURL(e.target.value)}
                label="Callback URL"
                helperText="We'll notify this URL when a payment is made (see below)"
                maxLength={64}
                value={callbackURL}
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
      <ClientCodeExample rawButtonHtml={rawButtonHtml} />
      <PreviewButton
        {...{
          merchantID,
          buttonText,
          dialogTitle,
          paymentID,
          amount,
          currency,
          callbackURL
        }}
      />
      <div className="hidden">
        <div
          className="payButton"
          merchantid={merchantID}
          buttontext={buttonText}
          amount={amount}
          currency={currency}
          dialogtitle={dialogTitle}
          paymentid={paymentID}
          callbackurl={callbackURL}
          ref={comp =>
            comp &&
            comp.outerHTML !== rawButtonHtml &&
            setRawButtonHtml(comp.outerHTML)
          }
        />
      </div>
    </div>
  )
}

export default withStyles(styles)(ButtonBuilder)
