import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'

export default ({ open, title, onClose, children }) => (
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
    <DialogContent>{children}</DialogContent>
  </Dialog>
)
