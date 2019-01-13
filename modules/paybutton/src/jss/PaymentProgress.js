export default () => ({
  qrCode: {
    width: '40%',
    margin: '1em auto',
    '@media (max-width: 768px)': {
      width: '70%'
    },
    '@media (max-width: 546px)': {
      width: '100%'
    }
  },
  walletButton: {
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
