/**
 * POST /xpub API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a POST endpoint for /xpub
 */
import { auth, mysql, handleResponse, handleError } from 'utils'
import bch from 'bitcore-lib-cash'

export default async (req, res) => {
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
