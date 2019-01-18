import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import styles from '../../jss/Index'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'

// const Card = withStyles(styles)(({ children, classes }) => (
//   <UICard className={classes.card}>{children}</UICard>
// ))
// Card.propTypes = {
//   children: PropTypes.any,
//   classes: PropTypes.object
// }

const IndexContent = ({ classes }) => (
  <div className={classes.card_grid_wrap}>
    <Card className={classes.mn}>
      <CardContent className={classes.main_card}>
        <div>
          <h2>Making Bitcoin Accessible For All</h2>
          <p>
            Gateway is making Bitcoin Cash (BCH) easy for merchants and website
            operators across the world. By standardizing the Bitcoin Cash
            payment experience, we can reduce friction and build on top of
            Bitcoin together.
          </p>
        </div>
        <div className={classes.card_image_wrap}>
          <img
            src="https://is2-ssl.mzstatic.com/image/thumb/Purple128/v4/b6/75/fd/b675fd99-1c2f-4929-6053-349e941e62b0/source/512x512bb.jpg"
            alt="Electron Cash Logo"
            title="Electron Cash Logo"
            className={classes.card_image}
          />
        </div>
      </CardContent>
    </Card>
    <Card className={classes.c1}>
      <CardContent>
        <h2>What We Do</h2>
        <p>
          Gateway is a free and open-source software project which provides
          merchants and businesses with the tools they need to make accepting
          Bitcoin Cash simple and easy.
        </p>
        <p>
          Our trademark PayButton is simplifying the payment experience for
          websites and apps across the ecosystem. Developers, community leaders
          and Bitcoin Cash ambassadors are constantly working to make the
          Gateway payment experience seamless and standard across all Bitcoin
          Cash applications.
        </p>
      </CardContent>
    </Card>
    <Card className={classes.c2}>
      <CardContent>
        <h2>Doing it Together</h2>
        <p>
          Gateway is an open platform pioneering open standards for the future
          of payments. We want to build a standard, unified and positive
          experience for both customers and merchants who decide that Bitcoin
          Cash is the way forward.
        </p>
      </CardContent>
    </Card>
    <Card className={classes.c3}>
      <CardContent>
        <h2>Doing it for Everyone</h2>
        <p>
          Billions of people across the earth don't have the financial tools
          they need to earn, save and build a life for themselves and their
          families. By making connections with shopkeepers and forging
          relationships with everyday people in third-world countries, we are
          learning their needs and building those tools on top of Bitcoin Cash.
        </p>
      </CardContent>
    </Card>
  </div>
)

IndexContent.propTypes = {
  classes: PropTypes.object
}

export default withStyles(styles)(IndexContent)
