import { postForm } from './utils'

const patchCommission = form => postForm('commissions', form, 'PATCH')
export default patchCommission
