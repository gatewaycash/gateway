export default () => ({
  commissions_title: {
    display: 'grid',
    'grid-template-columns': '10fr 1fr'
  },
  commissions_table: {
    '& td, & th': {
      'padding-left': '12px'
    }
  },
  tr_loading: {
    opacity: '0.2'
  },
  delete_commission: {
    display: 'grid',
    'justify-content': 'right'
  }
})
