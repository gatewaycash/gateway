export default () => ({
  title_wrap: {
    display: 'flex',
    'flex-direction': 'row',
    margin: 0,
    padding: '24px 24px 20px',
    'flex-basis': '90%'
  },
  title_wrap__root: {
    padding: 0,
    'border-bottom': '1px gray solid',
    display: 'flex',
    'flex-direction': 'row'
  },
  title: {
    'text-align': 'center',
    'flex-basis': '90%',
    'margin-left': '7%'
  },
  content_wrap: {
    overflow: 'hidden',
    padding: '24px',
    height: '100%'
  },
  close: {
    'margin-top': '2%',
    cursor: 'pointer',
    'margin-right': '2%'
  },
  container_root: {
    '@media (max-width: 546px)': {
      height: '90%',
      margin: '5%'
    }
  }
})
