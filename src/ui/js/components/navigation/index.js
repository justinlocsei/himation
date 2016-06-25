import React from 'react';

import NavigationPage from './page';

const Navigation = React.createClass({

  render: function() {
    return (
      <nav className="c--navigation">
        <ul className="c--navigation__pages">
          <NavigationPage name="About" />
          <NavigationPage name="Blog" />
          <NavigationPage name="Contact" />
        </ul>
      </nav>
    );
  }

});

export default Navigation;
