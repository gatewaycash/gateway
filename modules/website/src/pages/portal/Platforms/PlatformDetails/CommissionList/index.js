import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Table
} from '@material-ui/core'
import NewCommissionModal from './NewCommissionModal'
import styles from './style'
import withStyles from '@material-ui/core/styles/withStyles'
import { getCommissions } from 'API'
import CommissionLineItem from './CommissionLineItem'

const CommissionList = ({ classes, platformID, context }) => {
  const [commissionList, setCommissionList] = useState([])
  const [commissionListComponent, setCommissionListComponent] = useState()
  const [updateCommissionList, setUpdateCommissionList] = useState(0)
  const [
    shouldUpdateCommissionsList,
    setShouldUpdateCommissionsList
  ] = useState(0)

  useMemo(
    () => {
      getCommissions(platformID).then(commissions => {
        setCommissionList(commissions)
      })
    },
    [platformID, shouldUpdateCommissionsList, updateCommissionList]
  )
  useMemo(
    () => {
      let commissionLineItems = []
      commissionList.forEach(commission => {
        commissionLineItems.push(
          <CommissionLineItem
            commission={commission}
            tableContext={context}
            key={commission.commissionID}
            updateCommissionList={() =>
              setUpdateCommissionList(updateCommissionList + 1)
            }
          />
        )
      })
      setCommissionListComponent(<TableBody>{commissionLineItems}</TableBody>)
    },
    [commissionList, context]
  )

  return (
    <div>
      <div className={classes.commissions_title}>
        <h2>Commissions</h2>
        <NewCommissionModal
          platformID={platformID}
          onCreate={() =>
            setShouldUpdateCommissionsList(shouldUpdateCommissionsList + 1)
          }
        />
      </div>
      <form>
        <Table padding="dense" className={classes.commissions_table}>
          <TableHead>
            <TableRow>
              <TableCell>Label</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Percentage</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Less/More</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Address/XPUB</TableCell>
              <TableCell
                className={context.isEditing ? classes.delete_commission : ''}
              >
                {context.isEditing && context.deleteButton}
              </TableCell>
            </TableRow>
          </TableHead>
          {commissionListComponent}
        </Table>
      </form>
    </div>
  )
}

CommissionList.propTypes = {
  classes: PropTypes.object,
  platformID: PropTypes.string.isRequired,
  context: PropTypes.object
}

export default withStyles(styles)(CommissionList)
