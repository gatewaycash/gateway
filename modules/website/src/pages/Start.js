import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import { navigate } from '@reach/router'
import logo from './../res/logo.svg'

class StartPage extends Component {

  render() {
    return (
      <div className="mainContent">
        <img
          className="logoImage"
          alt="Gateway Logo"
          src={logo}
        />
        <h1 className="mainHeading">
          Service Temporarily Unavailable (under construction)
        </h1>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={navigate('identification')}
        >
          GET STARTED
        </Button>
        <br />
        <br />
        <Button
          href="https://www.youtube.com/watch?v=jduVN643Prc"
          target="_blank"
        >
          What is Bitcoin Cash?
        </Button>
      </div>
    )
  }
}

export default StartPage
