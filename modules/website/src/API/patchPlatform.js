import { postForm } from './utils'

const patchPlatform = form => postForm('platforms', form, 'PATCH')
export default patchPlatform
