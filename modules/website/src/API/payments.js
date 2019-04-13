import { get, generateError } from './utils'

export default async (
  keys = 'NO',
  unpaid = 'NO',
  page = 1,
  resultsPerPage = 25
) => {
  if (!sessionStorage.gatewayAPIKey) {
    return generateError(
      'Not Logged In',
      'Please go back and log in before viewing this page.'
    )
  }
  let response = await get(
    '/v2/user/payments',
    {
      APIKey: sessionStorage.gatewayAPIKey,
      includeKeys: keys,
      includeUnpaid: unpaid,
      page: page,
      resultsPerPage: resultsPerPage
    }
  )
  return response
}
