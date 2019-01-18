import { collapseThreshold } from './StyleConfig'

export default () => ({
  builder_wrap: {
    padding: '0 2%',
    display: 'grid',
    'grid-template-columns': 'repeat(3, 1fr)',
    'grid-column-gap': '2rem'
  },
  amount_controls: {
    display: 'grid',
    'grid-template-columns': 'repeat(2, auto)',
    'grid-column-gap': '2em'
  },
  [`@media only screen and (max-width: ${collapseThreshold})`]: {
    builder_wrap: {
      'grid-template-columns': 'none',
      'grid-row-gap': '1rem',
      'grid-template-rows': 'repeat(3, auto)'
    }
  }
})
