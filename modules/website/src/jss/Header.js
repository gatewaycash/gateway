import { collapseThreshold } from './StyleConfig'

export default () => ({
  header_wrap: {
    display: 'grid',
    'grid-template-columns': '1fr 1fr',
    'box-shadow': '-1px 3px 3px 0px rgba(0,0,0,0.2)',
    'background-color': 'white',
    padding: '0 2%',
    'margin-bottom': '2%',
    'align-items': 'center'
  },
  header_logo_wrap: {
    display: 'flex',
    padding: '1% 0',
    'flex-wrap': 'wrap',
    'align-items': 'center'
  },
  header_logo: {
    display: 'flex',
    'align-items': 'center',
    '& svg': {
      width: '20%;',
      'min-width': '64px'
    }
  },
  header_text: {
    'margin-left': '1%'
  },
  header_actions: {
    display: 'flex',
    'align-items': 'center',
    'list-style': 'none',
    'justify-content': 'flex-end',
    '& li': {
      transition: 'border 300ms ease-out',
      'border-bottom': '1px transparent solid',
      '&:hover': {
        'border-bottom-color': 'blue'
      }
    }
  },
  external_link: {
    width: '25%',
    color: '#3f51b5',
    'min-width': '12px',
    'max-width': '14px',
    'margin-top': '-12px'
  },
  what_is_bitcoin: {
    display: 'flex'
  },
  what_is_bitcoin__label: {
    display: 'grid',
    'grid-template-columns': 'repeat(2, auto)'
  },
  '@global .cls-1,.cls-3': {
    fill: '#3f51b5'
  },
  '@global .cls-2': {
    fill: '#fff'
  },
  'cls-3': {
    stroke: '#fff',
    'stroke-miterlimit': 10,
    'stroke-width': '1.6px'
  },
  [`@media only screen and (max-width: ${collapseThreshold})`]: {
    header_actions: {
      display: 'none'
    },
    header_wrap: {
      'margin-bottom': '3%'
    }
  }
})
