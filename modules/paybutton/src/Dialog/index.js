import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core'

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
    <DialogContent>
      {children}
    </DialogContent>
  </Dialog>
)
