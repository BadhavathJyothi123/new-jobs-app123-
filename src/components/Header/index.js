import {withRouter, Link} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="header-container">
      <ul className="list-container">
        <li className="logo-container">
          <Link to="/" className="nav-link">
            <img
              className="logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
        </li>
        <li className="logo-container">
          <Link to="/" className="nav-link">
            <h1 className="heading">Home</h1>
            <AiFillHome className="icon" />
          </Link>
          <Link to="/jobs" className="nav-link">
            <h1 className="heading">Jobs</h1>
            <BsBriefcaseFill className="icon" />
          </Link>
        </li>
        <li className="logo-container">
          <FiLogOut className="icon" onClick={onClickLogout} />
          <button className="btn" type="button" onClick={onClickLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
