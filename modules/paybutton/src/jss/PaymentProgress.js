export default () => ({
  qrCode: {
    width: '60%',
    margin: '0 auto',
    '@media (max-width: 546px)': {
      width: '100%'
    }
  },
  hideWalletButton: {
    width: 'fit-content',
    margin: '0 auto'
  },
  container: {
    display: 'flex',
    'flex-direction': 'column',
    'flex-grow': 1,
    height: '100%',
    'text-align': 'center'
  }
})
