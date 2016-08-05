import React, { PropTypes } from 'react';

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

          <a href={rootUrl} className="l--site__header__title">
            <span className="l--site__title for-cover">Cover</span>
            <span className="l--site__title for-your">Your</span>
            <span className="l--site__title for-basics">Basics</span>
          </a>

          <nav className="l--site__header__navigation"></nav>

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
