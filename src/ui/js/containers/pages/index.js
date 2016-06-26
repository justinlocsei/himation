import React from 'react';

import Page from 'himation/ui/js/components/pages';
import Site from 'himation/ui/js/containers/site';
import Survey from 'himation/ui/js/components/survey';

const HomePage = React.createClass({

  render: function() {
    return (
      <Site>
        <Page title="Home">
          <Survey />
        </Page>
      </Site>
    );
  }

});

export default HomePage;
