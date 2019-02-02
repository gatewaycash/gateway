import { mobileThreshold } from './StyleConfig'

export default () => ({
  content_wrap: {
    display: 'grid',
    'grid-template-columns': 'repeat(2, 1fr)',
    'grid-gap': '2rem',
    padding: '0 2%'
  },
  username: {
    'grid-column': 1
  },
  password: {
    'grid-column': 2
  },
  support_the_project: {
    'grid-column': '1/3'
  },
  [`@media only screen and (max-width: ${mobileThreshold})`]: {
    content_wrap: {
      'grid-row-gap': '1rem',
      'grid-template-columns': 'none'
    },
    username: {
      'grid-column': 1
    },
    password: {
      'grid-column': 1
    },
    support_the_project: {
      'grid-column': 1
    }
  }
})
