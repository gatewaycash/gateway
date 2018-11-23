import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

export default ({ open, title, handleClose, children, ...props }) => (
  <Dialog open={open} keepMounted onClose={handleClose}>
    <DialogTitle>
      <center>{title}</center>
    </DialogTitle>
    <DialogContent>
      <DialogContentText>{children}</DialogContentText>
    </DialogContent>
  </Dialog>
)
