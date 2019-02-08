import { collapseThreshold } from './StyleConfig'
export default () => ({
  action_icon: {
    'justify-self': 'right',
    padding: 0,
    'min-width': 0,
    color: '#f3f3f3'
  },
  external_link: {
    width: '25%',
    color: '#3f51b5',
    'min-width': '12px',
    'max-width': '14px',
    'margin-top': '-12px'
  },
  link: {
    outline: 'none',
    color: '#f3f3f3'
  },
  action_icon__label: {
    'justify-content': 'left'
  },
  menu_paper: {
    'background-color': '#444',
    'color': '#f3f3f3'
  },
  [`@media only screen and (min-width: ${collapseThreshold})`]: {
    action_icon: {
      display: 'none'
    }
  }
})
