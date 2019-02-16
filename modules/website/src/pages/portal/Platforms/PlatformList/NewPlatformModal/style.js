export default () => ({
  modal_wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    'background-color': 'rgba(0,0,0,0.8)',
    display: 'grid'
  },
  modal_content: {
    'align-self': 'center',
    'justify-self': 'center',
    padding: '0 2rem'
  },
  form: {
    display: 'grid',
    'grid-row-gap': '1em'
  },
  description_root: {
    border: '1px solid rgba(0,0,0,0.3)',
    'border-radius': '3px',
    'border-bottom': 'none'
  },
  create_button: {
    '& > *': {
      'pointer-events': 'none'
    }
  },
  new_platform: {
    height: 'max-content',
    'align-self': 'center'
  }
})
