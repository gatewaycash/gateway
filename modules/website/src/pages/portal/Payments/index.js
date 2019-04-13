import React, { useState, useEffect } from 'react'
import {
  Button,
  FormControlLabel,
  Switch,
  Card,
  CardContent
} from '@material-ui/core'
import NavigationMenu from './../NavigationMenu'
import { payments as fetchPayments, merchantid } from 'API'
import PayButton from '@gatewaycash/paybutton'
import { Payment, Footer } from 'components'
import withStyles from '@material-ui/core/styles/withStyles'
import styles from './style'
import PropTypes from 'prop-types'

const PaymentsPage = ({ classes }) => {
  const [showUnpaid, setShowUnpaid] = useState(false)
  const [showKeys, setShowKeys] = useState(false)
  const [payments, setPayments] = useState(<p>loading...</p>)
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [merchantID, setMerchantID] = useState('')

  const updateView = async newPage => {
    let response = await fetchPayments(
      showKeys ? 'YES' : 'NO',
      showUnpaid ? 'YES' : 'NO',
      newPage
    )
    if (response.status === 'success') {
      let parsedPayments = response.payments.map((payment, key) => (
        <Payment {...payment} key={key} />
      ))
      if (!parsedPayments.length) {
        parsedPayments = (
          <div className={classes.no_payments_wrap}>
            <p>
              No payments yet! Make a test payment and refresh the page.
            </p>
            {merchantID && (
              <PayButton
                merchantID={merchantID}
                buttonText="Make a Test Payment"
                dialogTitle="Make Payment and Refresh the Page!"
                paymentID="My first payment"
                gatewayServer={process.env.REACT_APP_GATEWAY_BACKEND}
              />
            )}
            <p>
              Your money will be returned to your merchant payout address. it
              may take a few seconds for your payment to appear.
            </p>
          </div>
        )
      }
      setPayments(parsedPayments)
      setMaxPage(response.maxPage)
      setPage(response.page)
    }
  }

  const fetchMerchantId = async () => {
    let response = await merchantid()
    if (response.status === 'success') {
      setMerchantID(response.merchantID)
    }
  }

  merchantID || fetchMerchantId()

  useEffect(
    () => {
      updateView()
    },
    [showKeys, showUnpaid, merchantID]
  )

  return (
    <>
      <NavigationMenu page="Your Payments" />
      <div className={classes.content_wrap}>
        <Card className={classes.view_payments}>
          <CardContent>
            <h2>View Your Payments</h2>
            <p>
              This is a list of payments made to your merchant account. They are
              sorted by date, the most recent payments appearing at the top.
            </p>
            <h3>About Unpaid and Unprocessed Payments</h3>
            <p>
              Unpaid and unprocessed payments usually occur when a customer
              clicks on a payment button but then closes it without making a
              payment. Pending payments (payments that haven't yet been
              processed) will also fall into this category.
            </p>
            <FormControlLabel
              control={
                <Switch
                  checked={showUnpaid}
                  onChange={e => setShowUnpaid(e.target.checked)}
                  color="primary"
                />
              }
              label="Show Unpaid and Unprocessed Payments"
            />
            <h3>About Private Keys</h3>
            <p>
              In short, a private key is like a password that unlocks the funds
              in a cryptocurrency address. Private keys should never be shared
              because anyone with your private keys can spend the money stored
              in the respective address. Likewise, no one can steal money from
              an address without the private key.
            </p>
            <p>
              Your Bitcoin wallet generally keeps track of your private keys for
              you. For addresses created by Gateway, we'll manage those keys but
              will optionally share them with you. It's your money after all!
            </p>
            <FormControlLabel
              control={
                <Switch
                  checked={showKeys}
                  onChange={e => setShowKeys(e.target.checked)}
                  color="primary"
                />
              }
              label="Show Private Keys"
            />
          </CardContent>
        </Card>
        <Card className={classes.payments}>
          <CardContent>
            <h1>Payments</h1>
            <h2>Page {page} of {maxPage}</h2>
            <Button
              onClick={() => updateView(page < 2 ? page : page - 1)}
            >
              Previous
            </Button>
            <Button
              onClick={() => updateView(page > maxPage ? page : page + 1)}
            >
              Next
            </Button>
            {payments}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  )
}

PaymentsPage.propTypes = {
  classes: PropTypes.object
}

export default withStyles(styles)(PaymentsPage)
