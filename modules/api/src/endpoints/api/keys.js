/**
 * GET /apikeys API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /apikeys
 */
import { mysql, auth, handleResponse } from 'utils'

let GET = async (req, res) => {
  let userIndex = await auth(req.body.APIKey, res)
  if (!userIndex) return

  // search for the record
  let result = await mysql.query(
    'SELECT * FROM APIKeys WHERE userIndex = ?',
    [userIndex]
  )

  // build the response
  let response = []
  result.forEach((e) => {
    let key = {
      created: e.created,
      APIKey: e.APIKey,
      label: e.label,
      active: e.active === 1
    }
    if (!key.active) {
      key.revocationDate = e.revocationDate
    }
    response.push(key)
  })

  handleResponse({
    APIKeys: response
  }, res)
}

export default {
  GET: GET
}
