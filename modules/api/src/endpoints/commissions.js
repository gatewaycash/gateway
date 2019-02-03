/**
 * Endpoint for /commissions
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines GET, PUT and PATCH endpoints for /commissions
 */
import {
  mysql,
  handleResponse,
  handleError,
  auth,
  platformAuth,
  validateAddress,
  validateXPUB
} from 'utils'
import sha256 from 'sha256'

// GET the commissions for a given platform
let GET = async (req, res) => {
  let userIndex = await auth(req.body.APIKey, res)
  if (!userIndex) return
  let platformIndex = await platformAuth(userIndex, req.body.platformID, res)
  if (!platformIndex) return
  let result = await mysql.query(
    `SELECT
      commissionID,
      label,
      commissionAmount,
      commissionCurrency,
      commissionPercentage,
      commissionLessMore,
      commissionAddress,
      commissionXPUB,
      commissionMethod
      FROM commissions
      WHERE platformIndex = ?`,
    [platformIndex]
  )
  return handleResponse({
    commissions: result,
    numberOfCommissions: result.length
  }, res)
}

// PATCH a commision with new data given the commission ID
let PATCH = async (req, res) => {
  // ensure commission ID was provided
  if (!req.body.commissionID) {
    return handleError(
      'Commission ID Required',
      'The commission ID is required',
      res
    )
  }

  // discover the commission
  let commission = await mysql.query(
    'SELECT * FROM commissions WHERE commissionID = ? LIMIT 1',
    [req.body.commissionID]
  )

  // error if the commission was not found
  if (commission.length !== 1) {
    return handleError(
      'Commission Not Found',
      'Either the commission cannot be found or you are not the owner',
      res
    )
  }

  commission = commission[0]

  // auth the user
  let userIndex = await auth(req.body.APIKey)
  if (!userIndex) return

  // discover the platform from the commission ID
  let platform = await mysql.query(
    'SELECT ownerUserIndex FROM platforms WHERE tableIndex = ? LIMIT 1',
    [commission.platformIndex]
  )

  // fail if the platform was not found
  if (platform.length !== 1) {
    return handleError(
      'Commission Not Found',
      'Either the commission cannot be found or you are not the owner',
      res
    )
  }

  // verify the user owns the platform
  if (userIndex != platform[0].ownerUserIndex) {
    return handleError(
      'Commission Not Found',
      'Either the commission cannot be found or you are not the owner',
      res
    )
  }

  // assign the new values
  let newCommissionLabel = req.body.newCommissionLabel || commission.label
  let newCommissionAddress = req.body.newCommissionAddress ||
    commission.commissionAddress
  let newCommissionXPUB = req.body.newCommissionXPUB ||
    commission.commissionXPUB
  let newCommissionMethod = req.body.newCommissionMethod ||
    commission.commissionMethod
  let newCommissionPercentage = req.body.newCommissionPercentage ||
    commission.commissionPercentage
  let newCommissionAmount = req.body.newCommissionAmount ||
    commission.commissionAmount
  let newCommissionCurrency = req.body.newCommissionCurrency ||
    commission.commissionCurrency
  let newCommissionLessMore = req.body.newCommissionLessMore ||
    commission.commissionLessMore

  // ensure commissionLabel is not too long
  if (newCommissionLabel.length > 36) {
    return handleError(
      'Commission Label Too Long',
      'The label most be shorter than 36 characters',
      res
    )
  }

  // ensure commissionMethod is valid
  if (newCommissionMethod !== 'address' && newCommissionMethod !== 'XPUB') {
    return handleError(
      'Invalid Commission Method',
      'Commission method must be either "address" or "XPUB"',
      res
    )
  }

  // ensure commissionXPUB is provided if commissionMethod is XPUB
  if (newCommissionMethod === 'XPUB') {
    if (!newCommissionXPUB) {
      return handleError(
        'Commission Method Error',
        'The commission method is XPUB but no XPUB key was provided',
        res
      )
    }
  }

  // ensure commissionAddress is provided if commissionMethod is address
  if (newCommissionMethod === 'address') {
    if (!newCommissionAddress) {
      return handleError(
        'Commission Method Error',
        'The commission method is address but no address was provided',
        res
      )
    }
  }

  // ensure commissionAddress or commissionXPUB was provided
  if (!newCommissionAddress && !newCommissionXPUB) {
    return handleError(
      'Address or XPUB Required',
      'Either an address or an XPUB key is required',
      res
    )
  }

  // validate the address if it was given
  if (newCommissionAddress) {
    newCommissionAddress = validateAddress(newCommissionAddress)
    if (!newCommissionAddress) return
  }

  // validate the XPUB key if it was given
  if (newCommissionXPUB) {
    newCommissionXPUB = validateXPUB(newCommissionXPUB)
    if (!newCommissionXPUB) return
  }

  // ensure commissionAmount is positive number or 0
  if (
    isNaN(newCommissionAmount) ||
    newCommissionAmount < 0
  ) {
    return handleError(
      'Invalid Commission Amount',
      'Commission amount must be a positive number or 0',
      res
    )
  }

  // ensure commissionCurrency is supported
  let supportedCurrencies = ['BCH', 'USD', 'EUR', 'JPY', 'CNY']
  if (!supportedCurrencies.some(x => newCommissionCurrency === x)) {
    return handleError(
      'Unsopported Currency',
      'Commission Currency must be one of BCH, USD, EUR, JPY or CNY',
      res
    )
  }

  // ensure commissionPercentage is positive number between 0 and 75
  if (
    isNaN(newCommissionPercentage) ||
    newCommissionPercentage < 0 ||
    newCommissionPercentage > 75
  ) {
    return handleError(
      'Invalid Commission Percentage',
      'The commission percentage must be a number between 0 and 75 percent. (decimals are OK)',
      res
    )
  }

  // ensure newCommissionLessMore is less or more
  if (
    newCommissionLessMore !== 'less' &&
    newCommissionLessMore !== 'more'
  ) {
    return handleError(
      'Invalid Commission Less/More Value',
      'The value must either be "less" or "more".',
      res
    )
  }

  // update the commission
  await mysql.query(
    `UPDATE commissions
      SET
      commissionAddress = ?,
      commissionXPUB = ?,
      commissionMethod = ?,
      commissionAmount = ?,
      commissionCurrency = ?,
      commissionPercentage = ?,
      commissionLessMore = ?,
      label = ?
      WHERE tableIndex = ?
      LIMIT 1`,
    [
      newCommissionAddress,
      newCommissionXPUB,
      newCommissionMethod,
      newCommissionAmount,
      newCommissionCurrency,
      newCommissionPercentage,
      newCommissionLessMore,
      newCommissionLabel,
      commission.tableIndex
    ]
  )

  // send success message to user
  return handleResponse({
    newCommissionLabel: newCommissionLabel,
    newCommissionAddress: newCommissionAddress,
    newCommissionXPUB: newCommissionXPUB,
    newCommissionMethod: newCommissionMethod,
    newCommissionAmount: newCommissionAmount,
    newCommissionCurrency: newCommissionCurrency,
    newCommissionPercentage: newCommissionPercentage,
    newCommissionLessMore: newCommissionLessMore
  }, res)
}

// PUT a new commission in the database
let PUT = async (req, res) => {
  // ensure platform ID was provided
  if (!req.body.platformID) {
    return handleError(
      'Platform ID Required',
      'The platform ID is required',
      res
    )
  }

  // ensure required fields were provided
  if (
    !req.body.commissionLabel ||
    !req.body.commissionAmount ||
    !req.body.commissionCurrency ||
    !req.body.commissionPercentage ||
    !req.body.commissionLessMore
  ) {
    return handleError(
      'Required Fields Missing',
      'Commission label, amount, currency, percentage, and less/more values are required',
      res
    )
  }

  // auth the user
  let userIndex = await auth(req.body.APIKey)
  if (!userIndex) return

  // discover the platform from the platform ID
  let platform = await mysql.query(
    `SELECT
      tableIndex,
      ownerUserIndex
      FROM platforms
      WHERE
      platformID = ?
      LIMIT 1`,
    [req.body.platformID]
  )

  // fail if the platform was not found
  if (platform.length !== 1) {
    return handleError(
      'Platform Not Found',
      'Either the platform cannot be found or you are not the owner',
      res
    )
  }

  // verify the user owns the platform
  if (userIndex != platform[0].ownerUserIndex) {
    return handleError(
      'Platform Not Found',
      'Either the platform cannot be found or you are not the owner',
      res
    )
  }

  // ensure commissionLabel is not too long
  if (req.body.commissionLabel.length > 36) {
    return handleError(
      'Commission Label Too Long',
      'The label most be shorter than 36 characters',
      res
    )
  }

  // ensure commissionAddress or commissionXPUB was provided
  if (!req.body.commissionAddress && !req.body.commissionXPUB) {
    return handleError(
      'Address or XPUB Required',
      'Either an address or an XPUB key is required',
      res
    )
  }

  // validate the address if it was given
  if (req.body.commissionAddress) {
    req.body.commissionAddress = validateAddress(req.body.commissionAddress)
    if (!req.body.commissionAddress) return
  }

  // validate the XPUB key if it was given
  if (req.body.commissionXPUB) {
    req.body.commissionXPUB = validateXPUB(req.body.commissionXPUB)
    if (!req.body.commissionXPUB) return
  }

  // ensure commissionAmount is positive number or 0
  if (
    isNaN(req.body.commissionAmount) ||
    req.body.commissionAmount < 0
  ) {
    return handleError(
      'Invalid Commission Amount',
      'Commission amount must be a positive number or 0',
      res
    )
  }

  // ensure commissionCurrency is supported
  let supportedCurrencies = ['BCH', 'USD', 'EUR', 'JPY', 'CNY']
  if (!supportedCurrencies.some(x => req.body.commissionCurrency === x)) {
    return handleError(
      'Unsopported Currency',
      'Commission Currency must be one of BCH, USD, EUR, JPY or CNY',
      res
    )
  }

  // ensure commissionPercentage is positive number between 0 and 75
  if (
    isNaN(req.body.commissionPercentage) ||
    req.body.commissionPercentage < 0 ||
    req.body.commissionPercentage > 75
  ) {
    return handleError(
      'Invalid Commission Percentage',
      'The commission percentage must be a number between 0 and 75 percent. (decimals are OK)',
      res
    )
  }

  // ensure newCommissionLessMore is less or more
  if (
    req.body.commissionLessMore !== 'less' &&
    req.body.commissionLessMore !== 'more'
  ) {
    return handleError(
      'Invalid Commission Less/More Value',
      'The value must either be "less" or "more".',
      res
    )
  }

  // generate a commission ID
  let commissionID = sha256(require('crypto').randomBytes(32)).substr(0, 16)

  // update the commission
  await mysql.query(
    `INSERT INTO commissions (
      commissionAddress,
      commissionXPUB,
      commissionMethod,
      commissionAmount,
      commissionCurrency,
      commissionPercentage,
      commissionLessMore,
      label,
      commissionID,
      platformIndex
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.body.commissionAddress,
      req.body.commissionXPUB,
      req.body.commissionXPUB ? 'XPUB' : 'address',
      req.body.commissionAmount,
      req.body.commissionCurrency,
      req.body.commissionPercentage,
      req.body.commissionLessMore,
      req.body.commissionLabel,
      commissionID,
      platform[0].tableIndex
    ]
  )

  // send success message to user
  return handleResponse({
    commissionLabel: req.body.commissionLabel,
    commissionAddress: req.body.commissionAddress,
    commissionXPUB: req.body.commissionXPUB,
    commissionMethod: req.body.commissionXPUB ? 'XPUB' : 'address',
    commissionAmount: req.body.commissionAmount,
    commissionCurrency: req.body.commissionCurrency,
    commissionPercentage: req.body.commissionPercentage,
    commissionLessMore: req.body.commissionLessMore,
    commissionID: commissionID,
    platformID: req.body.platformID
  }, res)
}

// DETETE a commission from the database
let DELETE = async (req, res) => {
  if (!req.body.commissionID) {
    return handleError(
      'Commission ID Required',
      'A commission ID is required',
      res
    )
  }
  let userIndex = await auth(req.body.APIKey, res)
  if (!userIndex) return
  let commission = await mysql.query(
    'SELECT platformIndex from commissions WHERE commissionID = ? LIMIT 1',
    [req.body.commissionID]
  )
  if (commission.length !== 1) {
    return handleError(
      'Commission Not Found',
      'Either the ommission ID does not exist or you are not the owner',
      res
    )
  }
  commission = commission[0]
  let platform = await mysql.query(
    'SELECT ownerUserIndex FROM platforms WHERE tableIndex = ? LIMIT 1',
    [commission.platformIndex]
  )
  if (userIndex != platform[0].ownerUserIndex) {
    return handleError(
      'Commission Not Found',
      'Either the ommission ID does not exist or you are not the owner',
      res
    )
  }
  await mysql.query(
    'DELETE FROM commissions WHERE commissionID = ? LIMIT 1',
    req.body.commissionID
  )
  return handleResponse({}, res)
}

export default {
  GET: GET,
  PATCH: PATCH,
  PUT: PUT,
  DELETE: DELETE
}
