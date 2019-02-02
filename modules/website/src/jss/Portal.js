import { tabletThreshold } from './StyleConfig'

export default () => ({
  content_wrap: {
    display: 'grid',
    'grid-gap': '2em',
    padding: '0 2%'
  },
  login: {
    'grid-column': 1
  },
  register: {
    'grid-column': 2
  },
  onboarding_info: {
    'grid-column': '1/3'
  },
  [`@media only screen and (max-width: ${tabletThreshold})`]: {
    login: {
      'grid-column': 1
    },
    register: {
      'grid-column': 1
    },
    onboarding_info: {
      'grid-column': 1
    }
  }
})
