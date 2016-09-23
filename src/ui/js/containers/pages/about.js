import React from 'react';

import About from 'himation/ui/components/about';
import Page from 'himation/ui/components/page';

import 'himation/styles/about';

const AboutPage = React.createClass({

  render: function() {
    return (
      <Page>
        <About />
      </Page>
    );
  }

});

export default AboutPage;
