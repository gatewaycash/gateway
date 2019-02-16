export default () => ({
  less_more_helper_text: {
    'max-width': '10rem'
  },
  new_commission: {
    height: 'max-content',
    'align-self': 'center'
  },
  commission_form: {
    '&> div': {
      'padding-bottom': '0.5rem',
      '&> div': {
        'margin-right': '0.5rem'
      }
    }
  },
  label_controls: {
    display: 'grid',
    '& :first-child': {
      'grid-column': '1/3'
    },
    '& :last-child': {
      'grid-column': '3'
    }
  },
  address_controls: {
    display: 'grid',
    '& :last-child': {
      'grid-column': '2/4'
    }
  },
  new_commission_modal_title: {
    'text-align': 'center'
  },
  create_button: {
    '& > *': {
      'pointer-events': 'none'
    }
  }
})
