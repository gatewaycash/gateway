/**
 * Endpoint for /contribution
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines GET and PATCH endpoints for /contribution
 */
import { mysql, handleResponse, handleError, auth } from 'utils'

let GET = async (req, res) => {
  let userIndex = await auth(req.body.APIKey, res)
  if (!userIndex) return

  let result = await mysql.query(
    `SELECT
      contributionAmount,
      contributionCurrency,
      contributionPercentage,
      contributionLessMore,
      contributionTotal
      FROM users
      WHERE tableIndex = ?
      LIMIT 1`,
    [userIndex]
  )
  return handleResponse({
    contributionAmount: result[0].contributionAmount,
    contributionCurrency: result[0].contributionCurrency,
    contributionPercentage: result[0].contributionPercentage,
    contributionLessMore: result[0].contributionLessMore,
    contributionTotal: result[0].contributionTotal
  }, res)
}

let PATCH = async (req, res) => {
  // ensure required fields were provided
  if (
    !req.body.newContributionAmount ||
    !req.body.newContributionCurrency ||
    !req.body.newContributionPercentage ||
    !req.body.newContributionLessMore
  ) {
    return handleError(
      'Missing Required Field',
      'A required field is missing. Required fields: "newContributionAmount", "newContributionCurrency", "newContributionPercentage" and "newContributionLessMore".',
      res
    )
  }

  // ensure contributionAmount is positive number or 0
  if (
    isNaN(req.body.newContributionAmount) ||
    req.body.newContributionAmount < 0
  ) {
    return handleError(
      'Invalid Contribution Amount',
      'Contribution amount must be a positive number or 0',
      res
    )
  }

  // ensure contributionCurrency is supported
  let supportedCurrencies = ['BCH', 'USD', 'EUR', 'JPY', 'CNY']
  if (!supportedCurrencies.some(x => req.body.newContributionCurrency === x)) {
    return handleError(
      'Unsopported Currency',
      'Contribution Currency must be one of BCH, USD, EUR, JPY or CNY',
      res
    )
  }

  // ensure contributionPercentage is positive number between 0 and 75
  if (
    isNaN(req.body.newContributionPercentage) ||
    req.body.newContributionPercentage < 0 ||
    req.body.newContributionPercentage > 75
  ) {
    return handleError(
      'Invalid Contribution Percentage',
      'The contribution percentage must be a number between 0 and 75 percent. (decimals are OK)',
      res
    )
  }

  // ensure newContributionLessMore is less or more
  if (
    req.body.newContributionLessMore !== 'less' &&
    req.body.newContributionLessMore !== 'more'
  ) {
    return handleError(
      'Invalid Contribution Less/More Value',
      'The value must either be "less" or "more".',
      res
    )
  }

  // verify the user is authorized
  let userIndex = await auth(req.body.APIKey, res)
  if (!userIndex) return

  // update the username
  await mysql.query(
    `UPDATE users
      SET contributionAmount = ?,
      contributionCurrency = ?,
      contributionPercentage = ?,
      contributionLessMore = ?
      WHERE tableIndex = ?
      LIMIT 1`,
    [
      req.body.newContributionAmount,
      req.body.newContributionCurrency,
      req.body.newContributionPercentage,
      req.body.newContributionLessMore,
      userIndex
    ]
  )

  // send success message to user
  return handleResponse({
    newContributionAmount: req.body.newContributionAmount,
    newContributionCurrency: req.body.newContributionCurrency,
    newContributionPercentage: req.body.newContributionPercentage,
    newContributionLessMore: req.body.newContributionLessMore
  }, res)
}

export default {
  GET: GET,
  PATCH: PATCH
}
