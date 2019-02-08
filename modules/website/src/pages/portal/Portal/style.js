import { tabletThreshold, mobileThreshold } from 'style/config'

export default () => ({
  content_wrap: {
    display: 'grid',
    'grid-template-columns': 'repeat(3, 1fr)',
    'grid-gap': '2rem',
    padding: '0 2rem'
  },
  login: {
    'grid-column': 1
  },
  register: {
    'grid-column': 2
  },
  onboarding_info: {
    'grid-column': 3
  },
  [`@media only screen and (max-width: ${tabletThreshold})`]: {
    content_wrap: {
      'grid-template-columns': 'repeat(2, 1fr)',
      'grid-gap': '1.5rem',
      padding: '0 1.5rem'
    },
    login: {
      'grid-column': 1
    },
    register: {
      'grid-column': 2
    },
    onboarding_info: {
      'grid-column': '1/span 2'
    }
  },
  [`@media only screen and (max-width: ${mobileThreshold})`]: {
    content_wrap: {
      'grid-template-columns': 'none',
      padding: '0 1rem'
    },
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
