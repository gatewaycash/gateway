import React from 'react'
import Paper from '@material-ui/core/Paper'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch'

export default () => (
  <Paper className="paper">
    <h2>Customize Your Button</h2>
    <p>
      Use the settings below to change various aspects of your payment button.
      Once you're satisfied with the result, scroll down and copy the generated
      code onto any website where you'd like to accept payments.
    </p>
    <TextField
      style={{
        width: '100%',
      }}
      onChange={this.handleChange}
      id="buttonTextField"
      label="Button Text"
      helperText="Give your payment button a label"
      maxLength={25}
      value={this.state.buttonText}
    />
    <br />
    <br />
    <FormControlLabel
      control={
        <Switch
          id="allowanyfield"
          checked={this.state.anyAmount}
          onChange={this.handleChange}
          color="primary"
        />
      }
      label="Allow any amount"
    />
    {!this.state.anyAmount && (
      <div>
        <TextField
          style={{
            width: '70%',
            float: 'left',
          }}
          onChange={this.handleChange}
          id="amountField"
          label="Amount"
          helperText="Amount in units of display currency"
          type="number"
          value={this.state.amount}
        />
        <TextField
          style={{
            width: '30%',
            float: 'right',
          }}
          onChange={this.handleChange}
          id="currencyField"
          label="Currency"
          helperText="BCH, USD, EUR..."
          maxLength={3}
          value={this.state.currency}
        />
        <br />
        <br />
        <br />
        <br />
      </div>
    )}
    {this.state.advanced ? (
      <div>
        <br />
        <TextField
          style={{
            width: '100%',
          }}
          onChange={this.handleChange}
          id="dialogTitleField"
          label="Dialog Title"
          helperText="Title for payment dialog box"
          maxLength={25}
          value={this.state.dialogTitle}
        />
        <br />
        <br />
        <TextField
          style={{
            width: '100%',
          }}
          onChange={this.handleChange}
          id="paymentIDField"
          label="Payment ID"
          helperText="Unique ID for payments sent to this button (see below)"
          maxLength={32}
          value={this.state.paymentID}
        />
        <br />
        <br />
        <TextField
          style={{
            width: '100%',
          }}
          onChange={this.handleChange}
          id="callbackURLField"
          label="Callback URL"
          helperText="We'll notify this URL when a payment is made (see below)"
          maxLength={64}
          value={this.state.callbackURL}
        />
        <br />
        <br />
      </div>
    ) : (
      <div>
        <p>
          If you're looking for more advanced functionality, you can further
          customize your button with some additional tweaks.
        </p>
        <center>
          <Button color="primary" onClick={this.toggleAdvanced}>
            Advanced Options
          </Button>
        </center>
      </div>
    )}
  </Paper>
)
