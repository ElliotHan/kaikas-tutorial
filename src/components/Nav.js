import React from 'react'

import './Nav.scss'

const Nav = () => (
  <header className="Nav">
    <div className="Nav__inner">
      <h1 className="Nav__logo">
        <a href="/">
          <img
            src="images/logo-kaikas-tutorial.png"
            alt="Klaystagram"
          />
        </a>
      </h1>
    </div>
  </header>
)

export default Nav
