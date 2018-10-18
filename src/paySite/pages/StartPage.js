import React, {Component} from 'react'

import Button from '@material-ui/core/Button'

import './mainContent.css'

class StartPage extends Component {
	
	constructor (props) {
		super (props)
		var xhr = new XMLHttpRequest()
		xhr.open('GET', 'https://gateway.cash/api/loggedin')
		xhr.onload = () => {
			if (xhr.readyState === 4) {
				if (xhr.responseText.toString().trim() === 'true') {
					this.props.updateView('createbutton')
				}
			}
		}
		xhr.send()
	}
	
  handleClick = () => {
    this.props.updateView('identify')
  }

  render () {
    return (
      <div className="mainContent">
      	<img
      		className="logoImage"
      		alt="Gateway Logo"
      		src="https://gateway.cash/images/favicon.svg"
      	/>
        <h1 className="mainHeading">Simple Bitcoin Payments</h1>
        <Button
          onClick={this.handleClick}
          variant="contained"
          color="primary"
          size="large"
        >
          GET STARTED
        </Button>
        <br/>
        <br/>
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
