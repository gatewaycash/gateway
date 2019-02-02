import React, { useState, useEffect } from 'react'
import { FormControlLabel, Switch } from '@material-ui/core'
import NavigationMenu from './NavigationMenu'
import { payments as fetchPayments, merchantid } from 'API'
import PayButton from '@gatewaycash/paybutton'
import { Text, Payment, Footer } from 'components'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import withStyles from '@material-ui/core/styles/withStyles'
import styles from '../../jss/Payments'

const PaymentsPage = ({ classes }) => {
  const [showUnpaid, setShowUnpaid] = useState(false)
  const [showKeys, setShowKeys] = useState(false)
  const [payments, setPayments] = useState(<Text centered>loading...</Text>)
  const [merchantID, setMerchantID] = useState('')

  const updateView = async () => {
    let response = await fetchPayments(
      showKeys ? 'YES' : 'NO',
      showUnpaid ? 'YES' : 'NO'
    )
    if (response.status === 'success') {
      let parsedPayments = response.payments.map((payment, key) => (
        <Payment {...payment} key={key} />
      ))
      if (!parsedPayments.length) {
        parsedPayments = (
          <div className={classes.no_payments_wrap}>
            <Text centered>
              No payments yet! Make a test payment and refresh the page.
            </Text>
            {merchantID && (
              <PayButton
                merchantID={merchantID}
                buttonText="Make a Test Payment"
                dialogTitle="Make Payment and Refresh the Page!"
                paymentID="My first payment"
                gatewayServer={process.env.REACT_APP_GATEWAY_BACKEND}
              />
            )}
            <Text centered>
              Your money will be returned to your merchant payout address. it
              may take a few seconds for your payment to appear.
            </Text>
          </div>
        )
      }
      setPayments(parsedPayments)
    }
  }

  const fetchMerchantId = async () => {
    let response = await merchantid()
    if (response.status === 'success') {
      setMerchantID(response.merchantID)
    }
  }

  merchantID || fetchMerchantId()

  const handleKeysChange = e => {
    setShowKeys(e.target.checked)
  }

  const handleUnpaidChange = e => {
    setShowUnpaid(e.target.checked)
  }

  useEffect(
    () => {
      updateView()
    },
    [showKeys, showUnpaid, merchantID]
  )

  return (
    <React.Fragment>
      <NavigationMenu page="Your Payments" />
      <div className={classes.content_wrap}>
        <Card className={classes.view_payments}>
          <CardContent>
            <h2>View Your Payments</h2>
            <Text>
              This is a list of payments made to your merchant account. They are
              sorted by date, the most recent payments appearing at the top.
            </Text>
            <h3>About Unpaid and Unprocessed Payments</h3>
            <Text>
              Unpaid and unprocessed payments usually occur when a customer
              clicks on a payment button but then closes it without making a
              payment. Pending payments (payments that haven't yet been
              processed) will also fall into this category.
            </Text>
            <FormControlLabel
              control={
                <Switch
                  checked={showUnpaid}
                  onChange={handleUnpaidChange}
                  color="primary"
                />
              }
              label="Show Unpaid and Unprocessed Payments"
            />
          </CardContent>
        </Card>
        <Card className={classes.payments}>
          <CardContent>
            <h2>Payments</h2>
            {payments}
          </CardContent>
        </Card>
        <Card className={classes.about_private_keys}>
          <CardContent>
            <h3>About Private Keys</h3>
            <Text>
              In short, a private key is like a password that unlocks the funds
              in a cryptocurrency address. Private keys should never be shared
              because anyone with your private keys can spend the money stored
              in the respective address. Likewise, no one can steal money from
              an address without the private key.
            </Text>
            <Text>
              Your Bitcoin wallet generally keeps track of your private keys for
              you. For addresses created by Gateway, we'll manage those keys but
              will optionally share them with you. It's your money after all!
            </Text>
            <FormControlLabel
              control={
                <Switch
                  checked={showKeys}
                  onChange={handleKeysChange}
                  color="primary"
                />
              }
              label="Show Private Keys"
            />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </React.Fragment>
  )
}

export default withStyles(styles)(PaymentsPage)
