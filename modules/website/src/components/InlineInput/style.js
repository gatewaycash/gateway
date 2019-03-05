const styles = {
  inline_input: {
    width: '3rem',
    'vertical-align': 'text-bottom'
  },
  inline_input_inner: {
    padding: 0,
    'text-align': 'center'
  },
  inline_input_root: {
    margin: 0
  }
}

export default () => ({
  ...styles,
  inline_input_wide: {
    ...styles.inline_input,
    width: '4.5rem'
  }
})
