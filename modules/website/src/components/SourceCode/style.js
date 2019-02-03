export default () => ({
  source_code: {
    'box-shadow': '0.2em 0.2em 0.4em #1b1b49',
    padding: '0.5em',
    color: 'white',
    'background-color': '#444444',
    margin: 0,
    'border-radius': '2px',
    'padding-right': '2em'
  },
  source_code_wrap: {
    position: 'relative',
    'padding-bottom': '1em'
  },
  copy_icon: {
    position: 'absolute',
    top: '10%',
    right: '1%',
    cursor: 'copy',
    padding: '0.1em',
    'border-radius': '5px',
    color: '#666',
    '&:hover': {
      'background-color': 'rgba(0,0,0,0.2)'
    }
  },
  tooltip: {
    margin: '5px'
  }
})
