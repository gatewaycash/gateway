import { tabletThreshold, mobileThreshold } from 'style/config'

export default () => ({
  main_content_wrap: {
    display: 'grid',
    'grid-template-columns': 'repeat(3, 1fr)',
    'grid-column-gap': '2rem',
    padding: '0 2rem',
    'min-height': '70vh'
  },
  why_of_crypto: {
    'grid-column': 3
  },
  [`@media only screen and (max-width: ${tabletThreshold})`]: {
    main_content_wrap: {
      'grid-row-gap': '1.5rem',
      'grid-template-columns': 'repeat(2, 1fr)',
      padding: '0 1.5rem'
    },
    why_of_crypto: {
      'grid-column': '1/span 2'
    }
  },
  [`@media only screen and (max-width: ${mobileThreshold})`]: {
    main_content_wrap: {
      'grid-row-gap': '1rem',
      'grid-template-columns': 'none',
      padding: '0 1rem'
    },
    why_of_crypto: {
      'grid-column': 1
    }
  }
})
