import React from 'react'
import Button from '@material-ui/core/Button'
import { Flex } from 'rebass'
import { Link } from '@reach/router'
import faviconImage from './../res/favicon.svg'

export default () => {
  return (
    <div className="mainContent">
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <img className="logoImage" alt="Gateway Logo" src={faviconImage} />
        <Link to="/identification">
          <Button variant="contained" color="primary" size="large">
            GET STARTED
          </Button>
        </Link>
        <br />
        <br />
        <Button
          href="https://www.youtube.com/watch?v=jduVN643Prc"
          target="_blank"
        >
          What is Bitcoin Cash?
        </Button>
      </Flex>
    </div>
  )
}
