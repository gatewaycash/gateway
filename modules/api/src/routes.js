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
  const addRoutes = (prefix, routes) => {
    Object.keys(routes).forEach(r => {
      if (routes[r].GET) app.get(`/v2/${prefix}${r}`, routes[r].GET)
      if (routes[r].PUT) app.put(`/v2/${prefix}${r}`, routes[r].PUT)
      if (routes[r].POST) app.post(`/v2/${prefix}${r}`, routes[r].POST)
      if (routes[r].PATCH) app.patch(`/v2/${prefix}${r}`, routes[r].PATCH)
      if (routes[r].DELETE) app.delete(`/v2/${prefix}${r}`, routes[r].DELETE)
    })
  }
  addRoutes('', endpoints)
  addRoutes('user/', userEndpoints)
  addRoutes('user/epayout/', payoutEndpoints)
  addRoutes('api/', apiEndpoints)
}
