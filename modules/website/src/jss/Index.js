const styles = {
  card: {
    margin: '2vw auto',
    'text-align': 'left'
  },
  main_card: {
    display: 'grid',
    'grid-template-columns': '2fr 1fr',
    margin: 0
  },
  card_image: {
    'max-width': '40%'
  },
  card_image_wrap: {
    'text-align': 'center'
  },
  card_grid_wrap: {
    display: 'grid',
    'grid-template-areas': '\'mn mn mn\' \'c1 c2 c3\' \'c1 c2 c3\'',
    'grid-column-gap': '2rem',
    padding: '1% 2%'
  },
  mn: {
    'grid-area': 'mn'
  },
  c1: {
    'grid-area': 'c1'
  },
  c2: {
    'grid-area': 'c2'
  },
  c3: {
    'grid-area': 'c3'
  },
  '@media only screen and (max-width: 510px)': {
    card_grid_wrap: {
      display: 'block',
      '& > *': {
        'grid-area': 'none'
      }
    },
    main_card: {
      'grid-template-rows': 'repeat(2, 1fr)',
      'grid-template-columns': 'none'
    },
    card_image: {
      'max-width': '60%'
    }
  }
}

export default () => ({
  ...styles,
  main_card: { ...styles.card, ...styles.mn, ...styles.main_card },
  c1: { ...styles.c1, ...styles.card },
  c2: { ...styles.c2, ...styles.card },
  c3: { ...styles.c3, ...styles.card }
})
