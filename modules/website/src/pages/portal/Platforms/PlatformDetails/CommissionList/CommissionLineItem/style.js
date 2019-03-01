export default () => ({
  td_root: {
    'border-bottom': 'none'
  },
  tr_root: {
    'border-bottom': '1px solid rgba(224, 224, 224, 1)'
  },
  edit_actions: {
    'justify-content': 'right',
    display: 'grid',
    'grid-auto-flow': 'column'
  },
  save_commission: {
    '& > *': {
      'pointer-events': 'none'
    }
  }
})
