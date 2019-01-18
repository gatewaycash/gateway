import { mobileThreshold } from './StyleConfig'
export default () => ({
  wrap: {
    'box-shadow': '0px -2px 3px 0px rgba(0,0,0,0.2)',
    'text-align': 'center',
    padding: '1% 0',
    display: 'grid',
    'font-size': '15px',
    'grid-template-areas': '\'a b c\' \'. d .\'',
    'margin-top': '3%',
    '& a': {
      display: 'block',
      '&:hover': {
        'text-decoration': 'underline'
      }
    }
  },
  legal: {
    'font-size': '13px'
  },
  a: {
    'grid-area': 'a'
  },
  b: {
    'grid-area': 'b'
  },
  c: {
    'grid-area': 'c'
  },
  d: {
    'grid-area': 'd'
  },
  [`@media only screen and (max-width: ${mobileThreshold})`]: {
    wrap: {
      'font-size': '12px',
      padding: '3%'
    }
  }
})
