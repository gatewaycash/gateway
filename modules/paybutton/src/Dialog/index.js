import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'

export default ({ open, title, onClose, children, ...props }) => (
  <Dialog
    open={open}
    keepMounted
    onClose={onClose}
    style={{
      fontFamily: 'helvetica'
    }}
  >
    <DialogTitle>
      <center>{title}</center>
    </DialogTitle>
    <DialogContent>
      {children}
    </DialogContent>
  </Dialog>
)
