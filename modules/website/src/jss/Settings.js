import { mobileThreshold } from './StyleConfig'
import { tabletThreshold } from './StyleConfig'

export default () => ({
  content_wrap: {
    display: 'grid',
    'grid-template-columns': 'repeat(6, 1fr)',
    'grid-gap': '2rem',
    padding: '0 2rem'
  },
  username: {
    'grid-column': '1/span 2'
  },
  password: {
    'grid-column': '3/span 2'
  },
  api_access: {
    'grid-column': '5/span 2'
  },
  display_currency: {
    'grid-column': '1/span 3'
  },
  support_project: {
    'grid-column': '4/span 3'
  },
  [`@media only screen and (max-width: ${tabletThreshold})`]: {
    content_wrap: {
      'grid-row-gap': '1.5rem',
      'grid-template-columns': 'repeat(2, 1fr)',
      'padding': '0 1.5rem'
    },
    username: {
      'grid-column': 1
    },
    password: {
      'grid-column': 2
    },
    api_access: {
      'grid-column': 1
    },
    display_currency: {
      'grid-column': 2
    },
    support_project: {
      'grid-column': '1/span 2'
    }
  },
  [`@media only screen and (max-width: ${mobileThreshold})`]: {
    content_wrap: {
      'grid-row-gap': '1rem',
      'grid-template-columns': 'none',
      'padding': '0 1rem'
    },
    username: {
      'grid-column': 1
    },
    password: {
      'grid-column': 1
    },
    api_access: {
      'grid-column': 1
    },
    display_currency: {
      'grid-column': 1
    },
    support_project: {
      'grid-column': 1
    }
  }
})
