/**
 * Defines routes for API endpoints
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines routes for API endpoints
 * @param {object} app - The Express server to define routes for
 */
import * as endpoints from 'endpoints'
import * as userEndpoints from 'endpoints/user'
import * as payoutEndpoints from 'endpoints/user/payout'
import * as apiEndpoints from 'endpoints/api'

export default app => {
  Object.keys(endpoints).forEach((e) => {
    if (endpoints[e].GET) app.get('/v2/' + e, endpoints[e].GET)
    if (endpoints[e].PUT) app.put('/v2/' + e, endpoints[e].PUT)
    if (endpoints[e].POST) app.post('/v2/' + e, endpoints[e].POST)
    if (endpoints[e].PATCH) app.patch('/v2/' + e, endpoints[e].PATCH)
    if (endpoints[e].DELETE) app.delete('/v2/' + e, endpoints[e].DELETE)
  })
  Object.keys(userEndpoints).forEach((e) => {
    if (userEndpoints[e].GET) app.get('/v2/user/' + e, userEndpoints[e].GET)
    if (userEndpoints[e].PUT) app.put('/v2/user/' + e, userEndpoints[e].PUT)
    if (userEndpoints[e].POST) app.post('/v2/user/' + e, userEndpoints[e].POST)
    if (userEndpoints[e].PATCH) {
      app.patch('/v2/user/' + e, userEndpoints[e].PATCH)
    }
    if (userEndpoints[e].DELETE) {
      app.delete('/v2/user/' + e, userEndpoints[e].DELETE)
    }
  })
  Object.keys(payoutEndpoints).forEach((e) => {
    if (payoutEndpoints[e].GET) {
      app.get('/v2/user/payout/' + e, payoutEndpoints[e].GET)
    }
    if (payoutEndpoints[e].PUT) {
      app.put('/v2/user/payout/' + e, payoutEndpoints[e].PUT)
    }
    if (payoutEndpoints[e].POST) {
      app.post('/v2/user/payout/' + e, payoutEndpoints[e].POST)
    }
    if (payoutEndpoints[e].PATCH) {
      app.patch('/v2/user/payout/' + e, payoutEndpoints[e].PATCH)
    }
    if (payoutEndpoints[e].DELETE) {
      app.delete('/v2/user/payout/' + e, payoutEndpoints[e].DELETE)
    }
  })
  Object.keys(apiEndpoints).forEach((e) => {
    if (apiEndpoints[e].GET) app.get('/v2/api/' + e, apiEndpoints[e].GET)
    if (apiEndpoints[e].PUT) app.put('/v2/api/' + e, apiEndpoints[e].PUT)
    if (apiEndpoints[e].POST) app.post('/v2/api/' + e, apiEndpoints[e].POST)
    if (apiEndpoints[e].PATCH) app.patch('/v2/api/' + e, apiEndpoints[e].PATCH)
    if (apiEndpoints[e].DELETE) {
      app.delete('/v2/api/' + e, apiEndpoints[e].DELETE)
    }
  })
}
