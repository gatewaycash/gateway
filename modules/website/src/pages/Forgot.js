import React, { Component } from 'react'

class ForgotPage extends Component {
  render() {
    return (
      <div className="mainContent">
        <h1 className="mainHeading">Forgot your password?</h1>
        <p>
          To recover your password, send an email to ty@tyweb.us. Include in
          your email a signed Bitcoin message from the address you used to
          create your account. Mention potato salad in your message so I know
          it's really you, amd I'll get back to you with a new password.
        </p>
      </div>
    )
  }
}

export default ForgotPage
