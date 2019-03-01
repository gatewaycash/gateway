import React, { useState } from 'react'
import { TableRow, TableCell, IconButton } from '@material-ui/core'
import PropTypes from 'prop-types'
import { Edit, Close, Check } from '@material-ui/icons'
import EditableTableCell from './EditableTableCell'
import { Provider, Context } from 'components/EditableText'
import styles from './style'
import withStyles from '@material-ui/core/styles/withStyles'
import { CurrencyPicker } from 'components'
import { CommissionLessMore, CommissionMethod } from 'components/Platforms'
import { CTSelect } from 'components/MUIOverrides'
import { patchCommission } from 'API'
import DeleteCommissionModal from './DeleteCommissionModal'

const CommissionLineItem = ({
  commission,
  classes,
  tableContext,
  updateCommissionList
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const saveCommission = async ev => {
    setIsLoading(true)
    const response = await patchCommission(ev.target.form)
    if (response.ok) {
      updateCommissionList()
      setIsLoading(false)
    }
  }

  return (
    <Provider>
      <Context.Consumer>
        {context => (
          <TableRow
            classes={{ root: classes.tr_root }}
            id="commission_row"
            data-commission-id={commission.commissionID}
            className={isLoading ? classes.tr_loading : ''}
          >
            <EditableTableCell
              value={commission.label}
              name="newCommissionLabel"
            >
              {commission.label}
            </EditableTableCell>
            <EditableTableCell
              value={commission.commissionAmount}
              name="newCommissionAmount"
            >
              {commission.commissionAmount}
            </EditableTableCell>
            <EditableTableCell
              value={commission.commissionPercentage}
              name="newCommissionPercentage"
            >
              {commission.commissionPercentage}
            </EditableTableCell>
            <EditableTableCell
              value={commission.commissionCurrency}
              EditComponent={() => (
                <CurrencyPicker
                  showHelperText={false}
                  SelectComponent={CTSelect}
                  inputProps={{ name: 'newCommissionCurrency' }}
                  value={commission.commissionCurrency}
                />
              )}
            >
              {commission.commissionCurrency}
            </EditableTableCell>
            <EditableTableCell
              value={commission.commissionLessMore}
              EditComponent={() => (
                <CommissionLessMore
                  showHelperText={false}
                  SelectComponent={CTSelect}
                  inputProps={{ name: 'newCommissionLessMore' }}
                  value={commission.commissionLessMore}
                />
              )}
            >
              {commission.commissionLessMore}
            </EditableTableCell>
            <EditableTableCell
              value={commission.commissionMethod}
              EditComponent={() => (
                <CommissionMethod
                  showHelperText={false}
                  SelectComponent={CTSelect}
                  inputProps={{ name: 'newCommissionMethod' }}
                  value={commission.commissionMethod}
                />
              )}
            >
              {commission.commissionMethod}
            </EditableTableCell>
            <EditableTableCell
              value={commission.commissionAddress || commission.commissionXPUB}
              name={
                commission.commissionMethod === 'address'
                  ? 'newCommissionAddress'
                  : 'newCommissionXPUB'
              }
            >
              {commission.commissionAddress || commission.commissionXPUB}
            </EditableTableCell>
            <TableCell
              align="right"
              className={classes.edit_actions}
              classes={{ root: classes.td_root }}
            >
              {context.editable ? (
                <React.Fragment>
                  <IconButton
                    onClick={ev => {
                      context.setEditable(false)
                      tableContext.setIsEditing(false)
                      saveCommission(ev)
                    }}
                    className={classes.save_commission}
                  >
                    <Check />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      context.setEditable(false)
                      tableContext.setIsEditing(false)
                    }}
                  >
                    <Close />
                  </IconButton>
                </React.Fragment>
              ) : (
                <IconButton
                  disabled={tableContext.isEditing}
                  onClick={() => {
                    if (!tableContext.isEditing) {
                      context.setEditable(true)
                      tableContext.setIsEditing(true)
                      tableContext.setDeleteButton(
                        <DeleteCommissionModal
                          commissionID={commission.commissionID}
                          apiKey={commission.APIKey}
                          updateCommissionList={updateCommissionList}
                          afterDelete={() => {
                            updateCommissionList()
                            context.setEditable(false)
                            tableContext.setIsEditing(false)
                          }}
                        />
                      )
                    }
                  }}
                >
                  <Edit />
                </IconButton>
              )}
              {context.editable && (
                <React.Fragment>
                  <input
                    type="hidden"
                    name="commissionID"
                    value={commission.commissionID}
                  />
                  <input
                    type="hidden"
                    name="APIKey"
                    value={commission.APIKey}
                  />
                </React.Fragment>
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
  classes: PropTypes.object,
  tableContext: PropTypes.object,
  updateCommissionList: PropTypes.func
}

export default withStyles(styles)(CommissionLineItem)
