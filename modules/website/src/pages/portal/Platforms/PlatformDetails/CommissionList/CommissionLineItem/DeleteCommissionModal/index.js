import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
  IconButton
} from '@material-ui/core'
import { DeleteForever } from '@material-ui/icons'
import PropTypes from 'prop-types'
import { deleteCommission } from 'API'

const DeleteCommissionModal = ({ apiKey, commissionID, afterDelete }) => {
  const [open, setOpen] = useState(false)
  return (
    <React.Fragment>
      <IconButton
        color="secondary"
        data-commission-id={commissionID}
        onClick={() => setOpen(true)}
      >
        <DeleteForever />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          Are you sure you want to delete the commission?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>This Action Cannot be Undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>CANCEL</Button>
          <Button
            color="secondary"
            onClick={async () => {
              await deleteCommission(apiKey, commissionID)
              setOpen(false)
              afterDelete()
            }}
          >
            DELETE
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

DeleteCommissionModal.propTypes = {
  commissionID: PropTypes.string,
  apiKey: PropTypes.string,
  afterDelete: PropTypes.func
}

export default DeleteCommissionModal
