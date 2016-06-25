import React, { PropTypes } from 'react';

import Navigation from 'himation/ui/js/components/navigation';

import 'himation/ui/scss/site';

const Site = React.createClass({

  propTypes: {
    children: PropTypes.element
  },

  render: function() {
    const { children } = this.props;

    return (
      <div className="l--site">
        <header className="l--site__header">

          <h1 className="l--site__header__title">
            <a href="#" className="l--site__header__link">Cover Your Basics</a>
          </h1>

          <div className="l--site__navigation">
            <Navigation />
          </div>

        </header>

        <div className="l--site__body">
          <div className="l--site__body__content">
            {children}
          </div>
        </div>
      </div>
    );
  }

});

export default Site;
