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

const Transition = props => <Zoom {...props} />

const NewPlatformModal = ({ classes, onCreate }) => {
  const [open, setOpen] = useState(false)
  const createPlatform = async ev => {
    const response = await fetch(
      `${process.env.REACT_APP_GATEWAY_BACKEND}/v2/platforms`,
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
        className={classes.new_platform}
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
          <DialogTitle>Create a New Platform</DialogTitle>
          <form className={classes.form}>
            <input
              type="hidden"
              value={sessionStorage.gatewayAPIKey}
              name="APIKey"
            />
            <TextField
              type="text"
              placeholder="Platform Name"
              name="name"
              required
              helperText="Required"
            />
            <TextField
              type="text"
              placeholder="Platform Description..."
              name="description"
              multiline={true}
              rows="3"
              rowsMax="5"
              helperText="Optional"
              InputProps={{
                classes: {
                  root: classes.description_root
                }
              }}
            />
            <DialogActions>
              <Button variant="contained" onClick={() => setOpen(false)}>
                CANCEL
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={createPlatform}
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

NewPlatformModal.propTypes = {
  classes: PropTypes.object,
  onCreate: PropTypes.func
}

export default withStyles(styles)(NewPlatformModal)
