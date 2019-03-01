import React, { useState } from 'react'
import styles from './style'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Zoom from '@material-ui/core/Zoom'
import { CurrencyPicker } from 'components'
import { CommissionLessMore, CommissionMethod } from 'components/Platforms'
import FormGroup from '@material-ui/core/FormGroup'

const Transition = props => <Zoom {...props} />

const NewCommissionModal = ({ classes, platformID, onCreate }) => {
  const [open, setOpen] = useState(false)
  const [method, setMethod] = useState('address')

  //TODO: Abstract this out to a postForm function in API dir
  const createCommission = async ev => {
    const response = await fetch(
      `${process.env.REACT_APP_GATEWAY_BACKEND}/v2/commissions`,
      {
        method: 'PUT',
        mode: 'cors',
        body: new URLSearchParams(new FormData(ev.target.form)),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ).then(response => response.json())
    console.log(response)
    if (response.status !== 'error') {
      setOpen(false)
      onCreate()
    } else {
      //TODO Render an error message with the response data of response.error != void 0
    }
  }
  return (
    <React.Fragment>
      <Button
        className={classes.new_commission}
        variant="contained"
        onClick={() => setOpen(true)}
      >
        NEW
      </Button>
      <Dialog
        className={classes.modal_content}
        open={open}
        TransitionComponent={Transition}
        onClose={() => setOpen(false)}
      >
        <DialogContent>
          <DialogTitle className={classes.new_commission_modal_title}>
            New Commission
          </DialogTitle>
          <form className={classes.commission_form}>
            <input
              type="hidden"
              value={sessionStorage.gatewayAPIKey}
              name="APIKey"
            />
            <input type="hidden" value={platformID} name="platformID" />
            <FormGroup row={true} className={classes.label_controls}>
              <TextField
                type="text"
                placeholder="Commission Label"
                name="commissionLabel"
                required
                helperText="Required"
              />
              <CurrencyPicker inputProps={{ name: 'commissionCurrency' }} />
            </FormGroup>
            <FormGroup row={true} className={classes.address_controls}>
              <CommissionMethod
                value={method}
                onChange={ev => setMethod(ev.target.value)}
              />
              {method === 'address' ? (
                <TextField
                  type="string"
                  placeholder="Bitcoin Cash Address"
                  name="commissionAddress"
                  required
                  helperText="Required"
                />
              ) : (
                <TextField
                  type="string"
                  placeholder="XPUB"
                  name="commissionXPUB"
                  required
                  helperText="Required"
                />
              )}
            </FormGroup>
            <FormGroup row={true}>
              <TextField
                type="number"
                placeholder="Commission Amount"
                name="commissionAmount"
                required
                helperText="Required"
              />
              <TextField
                type="number"
                placeholder="Commission Percentage"
                name="commissionPercentage"
                required
                helperText="Required"
              />
              <CommissionLessMore
                classes={{ root: classes.less_more_helper_text }}
              />
            </FormGroup>
            <DialogActions>
              <Button variant="contained" onClick={() => setOpen(false)}>
                CANCEL
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={createCommission}
                className={classes.create_button}
              >
                CREATE
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

NewCommissionModal.propTypes = {
  classes: PropTypes.object,
  platformID: PropTypes.string.isRequired,
  onCreate: PropTypes.func
}

export default withStyles(styles)(NewCommissionModal)
