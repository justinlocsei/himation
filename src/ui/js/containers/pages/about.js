import React from 'react';

import Page from 'himation/ui/js/components/pages';
import Site from 'himation/ui/js/containers/site';

const AboutPage = React.createClass({

  render: function() {
    return (
      <Site>
        <Page title="About">
          <p>About page</p>
        </Page>
      </Site>
    );
  }

});

export default AboutPage;
