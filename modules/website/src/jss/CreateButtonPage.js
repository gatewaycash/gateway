import { collapseThreshold } from './StyleConfig'

export default () => ({
  content_wrap: {
    display: 'grid',
    'grid-template-columns': 'repeat(3, 1fr)',
    'grid-column-gap': '2rem',
    padding: '0 2%'
  },
  [`@media only screen and (max-width: ${collapseThreshold})`]: {
    content_wrap: {
      'grid-template-columns': 'none',
      'grid-row-gap': '1rem',
      'grid-template-rows': 'repeat(3, auto)'
    }
  },
  button_builder_wrap: {
    display: 'grid',
    'grid-row-gap': '2rem'
  }
})
