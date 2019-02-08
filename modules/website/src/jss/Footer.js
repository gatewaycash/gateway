import { mobileThreshold } from './StyleConfig'
export default () => ({
  wrap: {
    'box-shadow': '0px -2px 3px 0px rgba(144,144,224,0.3)',
    'text-align': 'center',
    padding: '1% 0',
    display: 'grid',
    'font-size': '15px',
    color: '#f3f3f3',
    'background-color': '#444',
    'grid-template-areas': '\'a b c\' \'. d .\'',
    'margin-top': '3%',
    '& a': {
      display: 'block',
      '&:hover': {
        'text-decoration': 'underline'
      }
    }
  },
  link: {
    color: '#99c'
  },
  legal: {
    'font-size': '13px',
    color: '#999'
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
