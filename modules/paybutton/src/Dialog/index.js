import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import styles from '../jss/PaymentDialog'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'

let PaymentDialog = ({
  classes,
  open,
  title,
  onClose,
  children,
  closeDialog
}) => (
  <Dialog
    open={open}
    keepMounted
    onClose={onClose}
    style={{
      fontFamily: 'helvetica'
    }}
    PaperProps={{
      classes: {
        root: classes.container_root
      }
    }}
  >
    <DialogTitle
      disableTypography={true}
      classes={{ root: classes.title_wrap__root }}
    >
      <h2 className={classes.title_wrap}>
        <span className={classes.title}>{title}</span>
      </h2>
      <span className={classes.close} onClick={closeDialog}>
        ×
      </span>
    </DialogTitle>
    <DialogContent className={classes.content_wrap}>{children}</DialogContent>
  </Dialog>
)

PaymentDialog.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool,
  title: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.object,
  closeDialog: PropTypes.func
}

export default withStyles(styles)(PaymentDialog)
