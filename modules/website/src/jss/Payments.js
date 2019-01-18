import { mobileThreshold } from './StyleConfig'

export default () => ({
  content_wrap: {
    display: 'grid',
    'grid-gap': '2rem',
    'grid-template-rows': 'repeat(2, auto)',
    'grid-template-columns': 'repeat(2, 1fr)',
    padding: '0 2%'
  },
  view_payments: {
    'grid-column': 1
  },
  payments: {
    'grid-column': '1 / 3'
  },
  about_private_keys: {
    'grid-column': 2,
    'grid-row': 1
  },
  [`@media only screen and (max-width: ${mobileThreshold})`]: {
    content_wrap: {
      'grid-gap': '1rem',
      'grid-template-columns': 'none'
    },
    payments: {
      'grid-column': 1
    },
    view_payments: {
      'grid-column': 1
    },
    about_private_keys: {
      'grid-column': 1
    }
  },
  no_payments_wrap: {
    'text-align': 'center'
  }
})
