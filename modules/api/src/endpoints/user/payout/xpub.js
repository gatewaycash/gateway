/**
 * GET /xpub API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /xpub
 */
import { mysql, handleResponse, handleError, auth } from 'utils'
import url from 'url'
import bch from 'bitcore-lib-cash'

let GET = async (req, res) => {
  console.log('GET /xpub requested')

  // parse the provided data
  const query = url.parse(req.url, true).query
  console.log(query)

  let userIndex = await auth(query.APIKey, res)
  if (!userIndex) return

  let result = await mysql.query(
    'SELECT payoutXPUB FROM users WHERE tableIndex = ? LIMIT 1',
    [userIndex]
  )
  return handleResponse({
    payoutXPUB: result[0].payoutXPUB
  }, res)
}

let PUT = async (req, res) => {
  console.log('POST /xpub requested')
  console.log(req.body)

  try {
    bch.HDNode.fromBase58(req.body.xpub)
  } catch (e) {
    return handleError(
      'Invalid XPUB key',
      'The XPUB key you provided is invalid',
      res
    )
  }

  let userIndex = await auth(req.body.APIKey)
  if (!userIndex) return

  await mysql.query(
    'UPDATE users SET payoutXPUB = ? WHERE tableIndex = ? LIMIT 1',
    [req.body.newXPUB, userIndex]
  )

  return handleResponse({
    newXPUB: req.body.newXPUB
  }, res)
}

export default {
  GET: GET,
  PUT: PUT
}
