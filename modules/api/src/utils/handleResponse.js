/**
 * Builds and sends the API response
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Builds and sends the API response
 */
export default (response, res) => {
  response.status = 'success'
  console.log(response)
  res.status(200).end(JSON.stringify(response))
  return true
}
