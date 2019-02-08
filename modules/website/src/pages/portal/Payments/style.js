import { tabletThreshold, mobileThreshold } from 'style/config'

export default () => ({
  content_wrap: {
    display: 'grid',
    'grid-gap': '2rem',
    'grid-template-rows': 'repeat(6, auto)',
    padding: '0 2rem'
  },
  view_payments: {
    'grid-column': '1/span 2'
  },
  payments: {
    'grid-column': '3/span 4'
  },
  no_payments_wrap: {
    'text-align': 'center'
  },
  [`@media only screen and (max-width: ${tabletThreshold})`]: {
    content_wrap: {
      'grid-gap': '1.5rem',
      'grid-template-columns': 'repeat(2, auto)',
      padding: '0 1.5rem'
    },
    payments: {
      'grid-column': '4/span 3'
    },
    view_payments: {
      'grid-column': '1/span 3'
    }
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
    }
  }
})
