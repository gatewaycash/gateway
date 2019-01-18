import { collapseThreshold } from './StyleConfig'
export default () => ({
  action_icon: {
    'justify-self': 'right',
    padding: 0,
    'min-width': 0
  },
  external_link: {
    width: '25%',
    color: '#3f51b5',
    'min-width': '12px',
    'max-width': '14px',
    'margin-top': '-12px'
  },
  link: {
    outline: 'none'
  },
  action_icon__label: {
    'justify-content': 'left'
  },
  [`@media only screen and (min-width: ${collapseThreshold})`]: {
    action_icon: {
      display: 'none'
    }
  }
})
