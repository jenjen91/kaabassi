import React from 'react'
import { Link } from 'gatsby'
import logo from '../img/kaabassi-logo.png'

const Navbar = () => (
  <nav className="navbar is-transparent">
    <div className="container">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item" title="Logo">
          <img src={logo} alt="Kaldi" style={{ width: '60px', maxHeight: 'none' }} />
        </Link>
      </div>
      <div className="navbar-start">
        <Link className="navbar-item nav-home" to="/">
          <b>Stichting Kaabassi</b>
        </Link>
        <Link className="navbar-item" to="/about">
          Over Ons
        </Link>
        <Link className="navbar-item" to="/products">
          Projeecten
        </Link>
        <Link className="navbar-item" to="/contact">
          Contact
        </Link>
        <Link className="navbar-item" to="/contact/examples">
          Form Examples
        </Link>
      </div>
      <div className="navbar-end">

      </div>
    </div>
  </nav>
)

export default Navbar
