import { tabletThreshold } from './StyleConfig'

export default () => ({
  main_content_wrap: {
    display: 'grid',
    'grid-template-columns': 'repeat(3, 1fr)',
    'grid-column-gap': '2rem',
    padding: '0 2%',
    'min-height': '60vh'
  },
  [`@media only screen and (max-width: ${tabletThreshold})`]: {
    main_content_wrap: {
      'grid-row-gap': '1rem',
      'grid-template-columns': 'none',
      'grid-template-rows': 'repeat(3, 1fr)'
    }
  }
})
