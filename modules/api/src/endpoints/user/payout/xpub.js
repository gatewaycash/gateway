/**
 * GET /xpub API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /xpub
 */
import { mysql, handleResponse, handleError, auth } from 'utils'
import bch from 'bitcore-lib-cash'

// GET endpoint for returning payoutXPUB
let GET = async (req, res) => {
  let userIndex = await auth(req.body.APIKey, res)
  if (!userIndex) return
  let result = await mysql.query(
    'SELECT payoutXPUB, XPUBIndex FROM users WHERE tableIndex = ? LIMIT 1',
    [userIndex]
  )
  return handleResponse({
    payoutXPUB: result[0].payoutXPUB,
    XPUBIndex: result[0].XPUBIndex
  }, res)
}

// PUT / PATCH requests for setting user XPUB keys
let PATCH = async (req, res) => {

  // validate the XPUB key
  try {
    new bch.HDPublicKey(req.body.newXPUB)
  } catch (e) {
    return handleError(
      'Invalid XPUB key',
      'The XPUB key you provided is invalid',
      res
    )
  }

  // authenticate the user
  let userIndex = await auth(req.body.APIKey)
  if (!userIndex) return

  // update the key
  await mysql.query(
    `UPDATE users
      SET payoutXPUB = ?,
      XPUBIndex = 0
      WHERE
      tableIndex = ?
      LIMIT 1`,
    [req.body.newXPUB, userIndex]
  )

  // return the new key
  return handleResponse({
    newXPUB: req.body.newXPUB,
    newXPUBIndex: 0
  }, res)
}

export default {
  GET: GET,
  PUT: PATCH,
  PATCH: PATCH
}
