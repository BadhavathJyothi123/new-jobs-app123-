import {Redirect} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', errorMsg: '', errorOcurred: false}

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 5,
    })
    history.replace('/')
  }

  onSubmitFail = err => {
    this.setState({errorMsg: err, errorOcurred: true})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDeatils = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDeatils),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      console.log(data)
      this.onSubmitFail(data.error_msg)
    }
  }

  render() {
    const {username, password, errorMsg, errorOcurred} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <form className="login-form-container" onSubmit={this.onSubmitForm}>
          <div className="form-login-container">
            <img
              className="website-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <label className="form-label" htmlFor="username">
            USERNAME
          </label>
          <br />
          <input
            className="form-input"
            type="text"
            value={username}
            onChange={this.onChangeUserName}
            placeholder="Username"
            id="username"
          />
          <br />
          <br />
          <label className="form-label" htmlFor="password">
            PASSWORD
          </label>
          <br />
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={this.onChangePassword}
            placeholder="Password"
            id="password"
          />
          <br />
          <br />
          <button className="form-submit-btn" type="submit">
            Login
          </button>
          {errorOcurred && <p className="error">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
