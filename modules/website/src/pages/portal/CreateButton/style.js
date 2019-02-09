import { tabletThreshold, mobileThreshold } from 'style/config'

export default () => ({
  content_wrap: {
    display: 'grid',
    'grid-template-columns': 'repeat(3, 1fr)',
    'grid-column-gap': '2rem',
    'grid-row-gap': '2rem',
    padding: '0 2rem'
  },
  [`@media only screen and (max-width: ${tabletThreshold})`]: {
    content_wrap: {
      'grid-template-columns': 'repeat(2, 1fr)',
      'grid-column-gap': '1.5rem',
      'grid-row-gap': '1.5rem',
      padding: '0 1.5rem'
    }
  },
  [`@media only screen and (max-width: ${mobileThreshold})`]: {
    content_wrap: {
      'grid-template-columns': 'none',
      'grid-column-gap': '1rem',
      'grid-row-gap': '1rem',
      padding: '0 1rem'
    }
  }
})
