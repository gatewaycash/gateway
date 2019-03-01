import { createMuiTheme } from '@material-ui/core/styles'

export const theme = createMuiTheme({
  overrides: {
    MuiSelect: {
      root: {
        'font-size': '0.8rem'
      }
    }
  },
  typography: { useNextVariants: true }
})
