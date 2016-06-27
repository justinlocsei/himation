import React from 'react';

import Page from 'himation/ui/js/components/pages';
import routes from 'himation/config/routes';
import Site from 'himation/ui/js/containers/site';
import Survey from 'himation/ui/js/components/survey';
import { guidToRoute } from 'himation/core/routing';

const HomePage = React.createClass({

  render: function() {
    const submitSurvey = guidToRoute(routes, 'himation.recommendations');

    return (
      <Site>
        <Page title="Home">
          <Survey formAction={submitSurvey.path} formMethod={submitSurvey.method} />
        </Page>
      </Site>
    );
  }

});

export default HomePage;
