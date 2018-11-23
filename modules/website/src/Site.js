import React, { Component } from 'react'
import StartPage from 'pages/StartPage'
import IdentificationPage from 'pages/IdentificationPage'
import RegisterPage from 'pages/RegisterPage'
import LoginPage from 'pages/LoginPage'
import ForgotPage from 'pages/ForgotPage'
import CreateButtonPage from 'pages/CreateButtonPage'
import PaymentsPage from 'pages/PaymentsPage'
import SettingsPage from 'pages/SettingsPage'

// include resource files in the build
// import paySound from "./res/ding.mp3";
// import background from "./res/background.svg";
// import Favicon from "./res/favicon.svg";

class Site extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 'start',
    }
    this.updateView = this.updateView.bind(this)
  }

  updateView(page) {
    this.setState({ currentPage: page })
  }

  render() {
    if (this.state.currentPage === 'start') {
      return <StartPage updateView={this.updateView} />
    } else if (this.state.currentPage === 'identify') {
      return <IdentificationPage updateView={this.updateView} />
    } else if (this.state.currentPage === 'register') {
      return <RegisterPage updateView={this.updateView} />
    } else if (this.state.currentPage === 'login') {
      return <LoginPage updateView={this.updateView} />
    } else if (this.state.currentPage === 'forgot') {
      return <ForgotPage updateView={this.updateView} />
    } else if (this.state.currentPage === 'createbutton') {
      return <CreateButtonPage updateView={this.updateView} />
    } else if (this.state.currentPage === 'payments') {
      return <PaymentsPage updateView={this.updateView} />
    } else if (this.state.currentPage === 'settings') {
      return <SettingsPage updateView={this.updateView} />
    } else {
      return (
        <div>
          <h1>Page not found</h1>
          <p>No page with the name {this.state.currentPage} exists.</p>
        </div>
      )
    }
  }
}

export default Site
