/**
 * GET /apikeys API endpoint
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a GET endpoint for /apikeys
 */
import { mysql, auth, handleResponse } from 'utils'
import url from 'url'

let GET = async (req, res) => {
  console.log('GET /apikeys requested')

  // parse the provided data
  const query = url.parse(req.url, true).query
  console.log(query)

  let userIndex = await auth(query.APIKey, res)
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
      key.revokedDate = e.revokedDate
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
