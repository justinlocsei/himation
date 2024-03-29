import anime from 'animejs';
import React from 'react';

import Page from 'himation/ui/components/page';
import Pitch from 'himation/ui/components/pitch';
import routes from 'himation/config/routes';
import Survey from 'himation/ui/components/survey';
import { guidToRoute } from 'himation/core/routing';
import { SURVEY_ANCHOR } from 'himation/core/constants';

import 'himation/styles/survey';

const HomePage = React.createClass({

  handleRequestSurvey: function() {
    const survey = document.getElementById(SURVEY_ANCHOR);
    const bounding = survey.getBoundingClientRect();
    const surveyTop = bounding.top + window.pageYOffset;

    anime({
      targets: ['body', 'html'],
      scrollTop: surveyTop,
      duration: 750,
      easing: 'easeOutCubic'
    });
  },

  render: function() {
    const submitSurvey = guidToRoute(routes, 'himation.recommendations');

    return (
      <Page>
        <Pitch onRequestSurvey={this.handleRequestSurvey} surveyId={SURVEY_ANCHOR} />
        <Survey formAction={submitSurvey.path} formMethod={submitSurvey.method} anchorId={SURVEY_ANCHOR} />
      </Page>
    );
  }

});

export default HomePage;
