import React from 'react'
import { TableRow, TableCell, IconButton } from '@material-ui/core'
import PropTypes from 'prop-types'
import { Edit, Close, Check } from '@material-ui/icons'
import EditableTableCell from './EditableTableCell'
import { Provider, Context } from './CommissionLineItemContext'
import styles from './style'
import withStyles from '@material-ui/core/styles/withStyles'
import { CurrencyPicker } from 'components'
import { CommissionLessMore, CommissionMethod } from 'components/Platforms'

const CommissionLineItem = ({ commission, classes }) => {
  const saveCommission = () => {
    // update commission here
  }

  return (
    <Provider>
      <Context.Consumer>
        {context => (
          <TableRow>
            <EditableTableCell>{commission.label}</EditableTableCell>
            <EditableTableCell>{commission.commissionAmount}</EditableTableCell>
            <EditableTableCell>
              {commission.commissionPercentage}
            </EditableTableCell>
            <EditableTableCell
              EditComponent={() => <CurrencyPicker showHelperText={false} />}
            >
              {commission.commissionCurrency}
            </EditableTableCell>
            <EditableTableCell
              EditComponent={() => (
                <CommissionLessMore showHelperText={false} />
              )}
            >
              {commission.commissionLessMore}
            </EditableTableCell>
            <EditableTableCell
              EditComponent={() => <CommissionMethod showHelperText={false} />}
            >
              {commission.commissionMethod}
            </EditableTableCell>
            <EditableTableCell>
              {commission.commissionAddress || commission.commissionXPUB}
            </EditableTableCell>
            <TableCell align="right" className={classes.edit_actions}>
              {context.editable ? (
                <React.Fragment>
                  <IconButton
                    onClick={() => {
                      context.setEditable(false)
                      saveCommission()
                    }}
                  >
                    <Check />
                  </IconButton>
                  <IconButton onClick={() => context.setEditable(false)}>
                    <Close />
                  </IconButton>
                </React.Fragment>
              ) : (
                <IconButton
                  onClick={() => context.setEditable(true)}
                  disabled={true}
                >
                  <Edit />
                </IconButton>
              )}
            </TableCell>
          </TableRow>
        )}
      </Context.Consumer>
    </Provider>
  )
}

CommissionLineItem.propTypes = {
  commission: PropTypes.object,
  classes: PropTypes.object
}

export default withStyles(styles)(CommissionLineItem)
