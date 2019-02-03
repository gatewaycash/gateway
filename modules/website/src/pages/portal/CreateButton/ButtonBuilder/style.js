import { collapseThreshold, tabletThreshold } from 'style/config'

const styles = {
  builder_wrap: {
    padding: '0 2%',
    display: 'grid',
    'grid-template-columns': 'repeat(3, 1fr)',
    'grid-column-gap': '2rem'
  },
  builder_content: {
    display: 'grid',
    'grid-row-gap': '0.5em',
    '& > p': {
      margin: 0
    }
  },
  expansion_root: {
    'box-shadow': 'none',
    display: 'grid',
    margin: 0,
    '&:before': {
      'background-color': 'transparent'
    }
  },
  expansion_summary_root: {
    padding: 0,
    color: '#3e4db8'
  },
  expansion_summary_root__reverse: {
    'grid-row': 2
  },
  expansion_summary_content: {
    'text-align': 'center',
    display: 'block',
    margin: '0 !important',
    '& > :last-child': {
      padding: 0
    }
  },
  expansion_details_root: {
    padding: 0,
    display: 'grid',
    'grid-gap': '0.5em'
  },
  expand_icon: {
    transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    transform: 'rotate(0deg)'
  },
  dialog_title: {
    'grid-column': '1/3'
  },
  amount: {
    'grid-column': 1
  },
  currency: {
    'grid-column': 2,
    'justify-content': 'flex-end'
  },
  amount_controls: {
    'box-shadow': 'none',
    'justify-self': 'center',
    width: '100%',
    display: 'grid',
    margin: 0,
    '&:before': {
      'background-color': 'transparent'
    }
  },
  amount_controls_inner: {
    display: 'grid',
    'grid-column-gap': '0.5em',
    padding: 0
  },
  any_amount_checkbox: {
    'justify-content': 'center',
    'min-height': '0 !important'
  },
  [`@media only screen and (max-width: ${collapseThreshold})`]: {
    builder_wrap: {
      'grid-template-columns': 'none',
      'grid-row-gap': '1rem',
      'grid-template-rows': 'repeat(3, auto)'
    }
  },
  [`@media only screen and (max-width: ${tabletThreshold})`]: {
    expansion_summary_icon: {
      right: '8px'
    }
  }
}

export default () => ({
  ...styles,
  expansion_summary_content__currency: {
    ...styles.expansion_summary_content,
    'text-align': 'left'
  },
  expand_icon__expanded: {
    ...styles.expand_icon,
    transform: 'rotate(180deg)'
  }
})
