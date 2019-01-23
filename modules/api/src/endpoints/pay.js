/**
 * POST /pay API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a POST endpoint for /pay
 */
import { mysql, handleError, handleResponse } from 'utils'
import bch from 'bitcore-lib-cash'
import bchaddr from 'bchaddrjs'

let POST = async (req, res) => {
  // ensure a merchant ID was given
  if (!req.body.merchantID) {
    return handleError(
      'No Merchant ID',
      'A merchant ID is required in order to generate the payment invoice. This is because Gateway needs to know where to send the funds once we receive then.',
      res
    )
  }

  // make sure the merchant ID is in the database
  let result = await mysql.query(
    `SELECT merchantID, payoutMethod, payoutXPUB, XPUBIndex
      FROM users
      WHERE
      merchantID = ?
      LIMIT 1`,
    [req.body.merchantID]
  )

  // fail unless there is exactly 1 result
  if (result.length !== 1) {
    return handleError(
      'Merchant ID Not Found',
      'The merchant ID you provided wasn\'t found in the database. Make sure you\'re sending the correct merchant ID.',
      res
    )
  }

  // define variables for callbackURL, paymentID and invoiceAmount
  const callbackURL = req.body.callbackURL || false
  const paymentID = req.body.paymentID || false
  const invoiceAmount = req.body.invoiceAmount || 0
  const payoutMethod = result[0].payoutMethod
  const payoutXPUB = result[0].payoutXPUB
  const XPUBIndex = result[0].XPUBIndex

  // make sure callback URL is not too long
  if (callbackURL && callbackURL.length > 250) {
    return handleError(
      'Callback URL Too Long',
      'The maximum length of a callback URL is 250 characters. Please find a way to shorten your callback URL, or consider using a URL shortening service.',
      res
    )
  }

  // check some basic aspects of the callback URL for validity.
  if (
    callbackURL &&
    (
      (
        callbackURL.indexOf('http://') !== 0 &&
        callbackURL.indexOf('https://') !== 0
      ) ||
      callbackURL.indexOf('.') === -1 ||
      callbackURL.length < 10
    )
  ) {
    return handleError(
      'Callback URL is not Valid',
      'Please check the callback URL you provided and make sure it is valid. Ensure it starts with http:// or https:// and that it resolves to a reachable server.',
      res
    )
  }

  // verify the payment ID is not too long
  if (paymentID && paymentID.length > 64) {
    return handleError(
      'Payment ID Too Long',
      'Payment IDs are used for distinguishing one payment from another. The maximum length of a payment ID is 64 characters. Please shorten your payment ID.',
      res
    )
  }

  // a variable to hold the paymentAddress
  let paymentAddress
  let paymentKey = false

  // if the merchant uses payoutAddress generate a new keypair and store it
  if (payoutMethod === 'address') {
    const privateKey = new bch.PrivateKey()
    paymentKey = privateKey.toWIF()
    paymentAddress = bchaddr.toCashAddress(
      privateKey.toAddress().toString()
    )

  // if the merchant uses XPUB then derive a new address and increment the index
  } else if (payoutMethod === 'XPUB') {
    let hdPub = new bch.HDPublicKey(payoutXPUB)
    let derivedKey = hdPub.derive(0).derive(XPUBIndex)
    let paymentPublicKey = new bch.PublicKey(derivedKey.publicKey)
    let address = new bch.Address(paymentPublicKey)
    paymentAddress = bchaddr.toCashAddress(
      address.toString()
    )
    await mysql.query(
      'UPDATE users SET XPUBIndex = XPUBIndex + 1 WHERE merchantID = ? LIMIT 1',
      [req.body.merchantID]
    )
  } else {
    return handleError(
      'Invalid Payout Method',
      'This merchant has an invalid payout method. Please try again later.',
      res
    )
  }

  // insert the record into the database
  result = await mysql.query(
    `INSERT INTO payments (
        merchantID,
        paymentID,
        paymentAddress,
        callbackURL,
        invoiceAmount
      ) values (?, ?, ?, ?, ?)`,
    [req.body.merchantID, paymentID, paymentAddress, callbackURL, invoiceAmount]
  )

  // add the payment key
  if (paymentKey) {
    let paymentIndex = await mysql.query(
      'SELECT tableIndex FROM payments WHERE paymentAddress = ?',
      [paymentAddress]
    )
    paymentIndex = paymentIndex[0].tableIndex
    await mysql.query(
      'INSERT INTO privateKeys (paymentIndex, paymentKey) VALUES (?, ?)',
      [paymentIndex, paymentKey]
    )
  }

  // send the payment address to the user
  return handleResponse({
    paymentAddress: paymentAddress
  }, res)
}

export default {
  POST: POST
}
