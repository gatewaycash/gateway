import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import { Link, navigate } from '@reach/router'
import faviconImage from './../res/favicon.svg'

class StartPage extends Component {
  constructor(props) {
    super(props)
    var xhr = new XMLHttpRequest()
    xhr.open('GET', process.env.REACT_APP_GATEWAY_BACKEND + '/loggedin')
    xhr.onload = () => {
      if (xhr.readyState === 4) {
        if (xhr.responseText.toString().trim() === 'true') {
          navigate('createbutton')
        }
      }
    }
    xhr.send()
  }

  render() {
    return (
      <div className="mainContent">
        <img
          className="logoImage"
          alt="Gateway Logo"
          src={faviconImage}
        />
        <h1 className="mainHeading">Service Temporarily Unavailable (under construction)</h1>
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
      </div>
    )
  }
}

export default StartPage
