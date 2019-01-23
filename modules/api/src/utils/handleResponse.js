/**
 * Builds and sends the API response
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Builds and sends the API response
 */
import prettyjson from 'prettyjson'

export default (response, res) => {
  response.status = 'success'
  console.log(prettyjson.render(response))
  res.status(200).end(JSON.stringify(response))
  return true
}
