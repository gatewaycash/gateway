import React, { useState, useMemo, useEffect } from 'react'
import { getContribution, totalsales, patchContribution } from 'API'
import {
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelActions,
  withStyles,
  Button
} from '@material-ui/core'
import PropTypes from 'prop-types'
import styles from './style'
import { InlineInput, LessMoreSelect, CurrencyPicker } from 'components'

const SupportProject = ({ className, classes }) => {
  const [totalContributed, setTotalContributed] = useState('Loading...')
  const [totalSales, setTotalSales] = useState('Loading...')
  const [enabled, setEnabled] = useState(false)
  const [currency, setCurrency] = useState('BCH')
  const [lessMore, setLessMore] = useState('more')
  const [percentage, setPercentage] = useState(0)
  const [amount, setAmount] = useState(0)
  const [doTriggerSave, setDoTriggerSave] = useState(false)

  useMemo(
    async () => {
      const contributionResponse = await getContribution()
      if (contributionResponse.status === 'success') {
        setTotalContributed(
          parseInt(contributionResponse.contributionTotal) / 100000000
        )
        setCurrency(contributionResponse.contributionCurrency)
        setLessMore(contributionResponse.contributionLessMore)
        setPercentage(contributionResponse.contributionPercentage)
        setAmount(contributionResponse.contributionAmount)
        setEnabled(
          parseInt(contributionResponse.contributionAmount) ||
            parseInt(contributionResponse.contributionPercentage)
            ? true
            : false
        )
      }

      const salesResponse = await totalsales()
      if (salesResponse.status === 'success') {
        setTotalSales(salesResponse.totalSales)
      }
    },
    [false]
  )

  useEffect(() => {
    if (doTriggerSave) {
      document.getElementById('save-button').click()
      setDoTriggerSave(false)
    }
  })

  const toggleEnabled = ev => {
    const { checked } = ev.target
    setEnabled(checked)
    if (!checked) {
      setPercentage(0)
      setAmount(0)
      setDoTriggerSave(true)
    }
  }

  return (
    <Card className={className}>
      <CardContent>
        <h2>Supporting the Project</h2>
        <p>
          If you'd like to support the project, you can choose to donate a
          portion of each payment made to your merchant account. This will
          always be off by default, but any support you're able to provide is
          much appreciated.
        </p>
        <FormControlLabel
          control={
            <Switch
              checked={enabled}
              onChange={toggleEnabled}
              value="enabled"
              color="primary"
            />
          }
          label="I would like to support the development of Gateway"
        />
        <ExpansionPanel expanded={enabled}>
          <form>
            <input
              type="hidden"
              name="APIKey"
              value={sessionStorage.gatewayAPIKey}
            />
            <ExpansionPanelDetails
              classes={{ root: classes.contributions_panel_root }}
            >
              <div className={classes.contribution_settings}>
                I would like to contribute{' '}
                {
                  <InlineInput
                    suffix="%"
                    placeholder="1"
                    InputProps={{
                      name: 'newContributionPercentage',
                      type: 'number'
                    }}
                    value={percentage}
                    onChange={ev => setPercentage(ev.target.value)}
                  />
                }{' '}
                or{' '}
                {
                  <InlineInput
                    suffix={currency}
                    variant="wide"
                    InputProps={{
                      name: 'newContributionAmount',
                      type: 'number'
                    }}
                    value={amount}
                    onChange={ev => setAmount(ev.target.value)}
                  />
                }{' '}
                of each transaction Gateway processes for me. I would like to
                contribute the{' '}
                {
                  <LessMoreSelect
                    moreText="Greater"
                    lessText="Lesser"
                    value={lessMore}
                    inputProps={{
                      name: 'newContributionLessMore'
                    }}
                    classes={{
                      root: classes.inlineSelectRoot
                    }}
                    selectClasses={{
                      select: classes.inlineSelect
                    }}
                  />
                }{' '}
                of those amounts.
                <br />I would like to contribute in{' '}
                {
                  <CurrencyPicker
                    value={currency}
                    className={classes.inlineSelectRoot}
                    showHelperText={false}
                    inputProps={{ name: 'newContributionCurrency' }}
                    SelectProps={{
                      classes: {
                        select: classes.inlineSelect
                      },
                      onChange: ev => setCurrency(ev.target.value)
                    }}
                  />
                }
              </div>
              <ul className={classes.contributions_info}>
                <li>Total Earnings: {totalSales}</li>
                <li>Total Contributions: {totalContributed}</li>
              </ul>
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button
                color="primary"
                variant="contained"
                onClick={ev => patchContribution(ev.target.form)}
                className={classes.save}
                id="save-button"
              >
                SAVE
              </Button>
            </ExpansionPanelActions>
          </form>
        </ExpansionPanel>
      </CardContent>
    </Card>
  )
}

SupportProject.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object
}

export default withStyles(styles)(SupportProject)
