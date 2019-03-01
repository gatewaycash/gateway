import React from 'react'
import { TableCell } from '@material-ui/core'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import { EditableText } from 'components'

const styles = {
  td: {
    padding: '4px',
    'word-break': 'break-word'
  },
  input: {
    padding: '10px 5px',
    'font-size': '0.8rem'
  },
  input_root: {
    'line-height': 'normal',
    display: 'block'
  },
  form_control_root: {
    display: 'block',
    overflow: 'hidden'
  }
}

const EditableTableCell = ({
  children,
  classes,
  align,
  EditComponent,
  name,
  value
}) => {
  return (
    <TableCell align={align || 'left'} classes={{ root: classes.td }}>
      <EditableText
        EditComponent={EditComponent}
        value={value}
        TextFieldProps={{
          name: name,
          InputProps: {
            classes: {
              input: classes.input,
              root: classes.input_root
            }
          },
          classes: { root: classes.form_control_root }
        }}
      >
        {children}
      </EditableText>
    </TableCell>
  )
}

EditableTableCell.propTypes = {
  children: PropTypes.any,
  classes: PropTypes.object,
  align: PropTypes.string,
  EditComponent: PropTypes.any,
  name: PropTypes.string,
  value: PropTypes.any,
  doSave: PropTypes.bool
}

export default withStyles(styles)(EditableTableCell)
