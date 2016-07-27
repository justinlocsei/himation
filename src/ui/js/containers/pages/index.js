import React from 'react';

import Page from 'himation/ui/components/pages';
import routes from 'himation/config/routes';
import Survey from 'himation/ui/components/survey';
import { guidToRoute } from 'himation/core/routing';

import 'himation/styles/survey';

const HomePage = React.createClass({

  render: function() {
    const submitSurvey = guidToRoute(routes, 'himation.recommendations');

    return (
      <Page>
        <Survey formAction={submitSurvey.path} formMethod={submitSurvey.method} />
      </Page>
    );
  }

});

export default HomePage;
