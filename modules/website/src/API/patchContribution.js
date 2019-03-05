import { postForm } from './utils'

const patchContribution = form => postForm('user/contribution', form, 'PATCH')
export default patchContribution
