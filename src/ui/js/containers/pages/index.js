import React from 'react';

import Page from 'himation/ui/js/components/pages';
import Site from 'himation/ui/js/containers/site';

const HomePage = React.createClass({

  render: function() {
    return (
      <Site>
        <Page title="Home">
          <p>Home page</p>
        </Page>
      </Site>
    );
  }

});

export default HomePage;
