/**
 * GET /payoutMethod API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /payoutMethod
 */
import { mysql, handleResponse, handleError, auth } from 'utils'
import bchaddr from 'bchaddrjs'
import bch from 'bitcore-lib-cash'

// GET request for discovering payoutMethod
let GET = async (req, res) => {
  let userIndex = await auth(req.body.APIKey, res)
  if (!userIndex) return

  let result = await mysql.query(
    'SELECT payoutMethod FROM users WHERE tableIndex = ? LIMIT 1',
    [userIndex]
  )
  return handleResponse({
    payoutMethod: result[0].payoutMethod
  }, res)
}

// PATCH method for changing payoutMethod
let PATCH = async (req, res) => {

  // basic validations
  if (!req.body.newPayoutMethod) {
    return handleError(
      'No Payout Method',
      'Provide a new payout method',
      res
    )
  }
  if (
    req.body.newPayoutMethod !== 'address' &&
    req.body.newPayoutMethod !== 'XPUB'
  ) {
    return handleError(
      'Invalid Payout Method',
      'Payout method must be one of "address" or "XPUB".',
      res
    )
  }

  // verify the API key
  let userIndex = await auth(req.body.APIKey, res)
  if (!userIndex) return

  // updating paymentMethod to be address
  if (req.body.newPayoutMethod === 'address') {

    // ensure the user has a valid payoutAddress
    let payoutAddress = await mysql.query(
      'SELECT payoutAddress FROM users WHERE tableIndex = ? LIMIT 1',
      [userIndex]
    )
    payoutAddress = payoutAddress[0].payoutAddress
    if (payoutAddress == null) {
      return handleError(
        'No Payment Address',
        'Payout method cannot be "address" when no address is on your account.',
        res
      )
    }
    try {
      bchaddr.toCashAddress(payoutAddress)
    } catch (e) {
      return handleError(
        'Invalid Address',
        `The address ( ${payoutAddress} ) on your account is invalid. Please update it.`,
        res
      )
    }
    // update the payoutMethod
    let result = await mysql.query(
      'UPDATE users SET payoutMethod = ? WHERE tableIndex = ? LIMIT 1',
      ['address', userIndex]
    )
    if (result.affectedRows === 1) {
      return handleResponse({
        newPayoutMethod: req.body.newPayoutMethod
      }, res)
    } else {
      return handleError(
        'Did Not Update',
        'The payout method was not updated (was it already "address"?)',
        res
      )
    }

  // updating payoutMethod to be XPUB
  } else {

    // ensure the user has a valid payoutXPUB
    let payoutXPUB = await mysql.query(
      'SELECT payoutXPUB FROM users WHERE tableIndex = ? LIMIT 1',
      [userIndex]
    )
    payoutXPUB = payoutXPUB[0].payoutXPUB
    if (payoutXPUB == null) {
      return handleError(
        'No Payment XPUB',
        'Payout method cannot be "XPUB" when no XPUB key is on your account.',
        res
      )
    }
    try {
      new bch.HDPublicKey(payoutXPUB)
    } catch (e) {
      return handleError(
        'Invalid XPUB Key',
        `The XPUB key ( ${payoutXPUB} ) on your account is invalid. Please update it.`,
        res
      )
    }
    // update the payoutMethod
    let result = await mysql.query(
      'UPDATE users SET payoutMethod = ? WHERE tableIndex = ? LIMIT 1',
      ['XPUB', userIndex]
    )
    if (result.affectedRows === 1) {
      return handleResponse({
        newPayoutMethod: req.body.newPayoutMethod
      }, res)
    } else {
      return handleError(
        'Did Not Update',
        'The payout method was not updated (was it already "XPUB"?)',
        res
      )
    }
  }
}

export default {
  GET: GET,
  PATCH: PATCH
}
