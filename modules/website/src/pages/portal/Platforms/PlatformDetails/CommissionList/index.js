import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import NewCommissionModal from './NewCommissionModal'
import styles from './style'
import withStyles from '@material-ui/core/styles/withStyles'
import { getCommissions } from 'API'
import CommissionLineItem from './CommissionLineItem'

const CommissionList = ({ classes, platformID }) => {
  const [commissionList, setCommissionList] = useState([])
  const [commissionListComponent, setCommissionListComponent] = useState()
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
    [platformID, shouldUpdateCommissionsList]
  )
  useMemo(
    () => {
      let commissionLineItems = []
      commissionList.forEach(commission => {
        commissionLineItems.push(
          <CommissionLineItem
            commission={commission}
            key={commission.commissionID}
          />
        )
      })
      setCommissionListComponent(<TableBody>{commissionLineItems}</TableBody>)
    },
    [commissionList]
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
            <TableCell />
          </TableRow>
        </TableHead>
        {commissionListComponent}
      </Table>
    </div>
  )
}

CommissionList.propTypes = {
  classes: PropTypes.object,
  platformID: PropTypes.string.isRequired
}

export default withStyles(styles)(CommissionList)
