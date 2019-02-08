import { collapseThreshold } from './StyleConfig'

export default () => ({
  header_wrap: {
    display: 'grid',
    'grid-template-columns': '1fr 1fr',
    'box-shadow': '-1px 4px 4px 0px rgba(144,144,224,0.3)',
    'background-color': '#444',
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
      width: '18%;',
      'min-width': '56px'
    }
  },
  header_text: {
    'margin-left': '2%',
    'color': '#f3f3f3'
  },
  header_actions: {
    display: 'flex',
    'align-items': 'center',
    'list-style': 'none',
    'justify-content': 'flex-end',
    '& li': {
      transition: 'border 300ms ease-out',
      'border-bottom': '1px transparent solid'
    }
  },
  external_link: {
    width: '25%',
    color: '#99c',
    'min-width': '12px',
    'max-width': '14px',
    'margin-top': '-12px'
  },
  what_is_bitcoin: {
    display: 'flex',
    color: '#f3f3f3'
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
