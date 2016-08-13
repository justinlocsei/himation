import React, { PropTypes } from 'react';

import logo from 'himation/images/branding/logo.svg';
import { getSetting } from 'himation/ui/config';

import 'himation/styles/site';

const Site = React.createClass({

  propTypes: {
    children: PropTypes.element
  },

  render: function() {
    const { children } = this.props;

    const rootUrl = getSetting('rootUrl');

    return (
      <div className="l--site">
        <header className="l--site__header">

          <a href={rootUrl} className="l--site__header__logo">
            <img src={logo} className="l--site__logo" alt="Cover Your Basics" width={68} height={85} />
          </a>

          <div className="l--site__header__branding">
            <p className="l--site__slogan">For professional women with better things to do than shop</p>
          </div>

        </header>

        <div className="l--site__body">
          <div className="l--site__body__content">
            {children}
          </div>
        </div>

        <footer className="l--site__footer">
          <ul className="l--site__footer__links">
            <li className="l--site__footer__link">
              <a href={rootUrl} className="l--site__footer__link-name">Home</a>
            </li>
          </ul>

          <p className="l--site__footer__copyright">&copy;{new Date().getFullYear()} Cover Your Basics</p>
        </footer>
      </div>
    );
  }

});

export default Site;
