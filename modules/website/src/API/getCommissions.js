import { fetchFromApi } from './utils'

const getCommissions = platformID =>
  fetchFromApi('commissions', void 0, { platformID })
export default getCommissions
