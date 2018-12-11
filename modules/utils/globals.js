let globals = ['GATEWAY_BACKEND']

export default globals.reduce(
  (acc, val) => ({
    ...acc,
    [val]: localStorage[val] || process.env[`REACT_APP_${val}`],
  }),
  {},
)
