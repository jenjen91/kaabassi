// components/Navbar.js
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => (
  // These are Bulma classes
  <nav className="navbar is-transparent" role="navigation" aria-label="main navigation">
    <div className="container">
      <div className="navbar-brand">
        <Link href="/" className="navbar-item" title="Logo">
          <Image
            src="/img/kaabassi-logo.png"
            alt="Stichting Kaabassi Logo"
            width={29.8}
            height={30}
          />
        </Link>
        {/* You might add a burger/mobile toggle here if using Bulma's JS-dependent navbar features */}
        {/* <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a> */}
      </div>

      {/* The `id` here usually corresponds to the `data-target` in a burger button */}
      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <Link className="navbar-item nav-home" href="/">
            <b>Stichting Kaabassi</b>
          </Link>
          <Link className="navbar-item" href="/about">
            Over Ons
          </Link>
          <Link className="navbar-item" href="/agenda">
            Agenda
          </Link>
          <Link className="navbar-item" href="/projecten">
            Projecten
          </Link>
          <Link className="navbar-item" href="/contact">
            Contact
          </Link>
        </div>
        <div className="navbar-end">
          {/* Other end-aligned items */}
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
