import React from 'react';

import Page from 'himation/ui/js/components/pages';
import routes from 'himation/config/routes';
import Survey from 'himation/ui/js/components/survey';
import { guidToRoute } from 'himation/core/routing';

const HomePage = React.createClass({

  render: function() {
    const submitSurvey = guidToRoute(routes, 'himation.recommendations');

    return (
      <Page title="Home">
        <Survey formAction={submitSurvey.path} formMethod={submitSurvey.method} />
      </Page>
    );
  }

});

export default HomePage;