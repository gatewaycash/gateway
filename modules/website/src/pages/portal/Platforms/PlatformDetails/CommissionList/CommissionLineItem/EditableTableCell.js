import React from 'react'
import { TableCell, TextField } from '@material-ui/core'
import PropTypes from 'prop-types'
import { Context } from './CommissionLineItemContext'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = {
  input: {
    padding: '10px 5px',
    'font-size': '0.8rem'
  },
  input_root: {
    'line-height': 'normal'
  },
  td: {
    padding: '4px'
  }
}

const EditableTableCell = ({
  children,
  classes,
  align,
  EditComponent,
  name
}) => (
  <Context.Consumer>
    {context => (
      <TableCell align={align || 'left'} classes={{ root: classes.td }}>
        {context.editable ? (
          EditComponent ? (
            <EditComponent>{children}</EditComponent>
          ) : (
            <TextField
              type="text"
              value={children}
              name={name}
              variant="outlined"
              InputProps={{
                classes: { input: classes.input, root: classes.input_root }
              }}
            />
          )
        ) : (
          children
        )}
      </TableCell>
    )}
  </Context.Consumer>
)

EditableTableCell.propTypes = {
  children: PropTypes.any,
  classes: PropTypes.object,
  align: PropTypes.string,
  EditComponent: PropTypes.any,
  name: PropTypes.string
}

export default withStyles(styles)(EditableTableCell)
