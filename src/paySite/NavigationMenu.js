import React, {Component} from 'react'

import Button from '@material-ui/core/Button'

class NavigationMenu extends Component {
  
  handleCreateButton = () => {
    this.props.updateView('createbutton')
  }
  
  handleViewPayments = () => {
    this.props.updateView('payments')
  }

  handleSettings = () => {
    this.props.updateView('settings')
  }
  
	render () {
		return (
			<div>
			  <center>
			    <h1>{this.props.page}</h1>
			    <Button
			      variant={this.props.page === 'Create a Button' && 'contained'}
			      color="primary"
			      onClick={this.handleCreateButton}
			    >
			      Create Button
			    </Button>
			    <Button
			      variant={this.props.page === 'View Payments' && 'contained'}
			      color="primary"
			      onClick={this.handleViewPayments}
			    >
			      View Payments
			    </Button>
			    <Button
			      variant={this.props.page === 'Settings' && 'contained'}
			      color="primary"
			      onClick={this.handleSettings}
			    >
			      Settings
			    </Button>
			  </center>
			</div>
		)
	}

}

export default NavigationMenu
