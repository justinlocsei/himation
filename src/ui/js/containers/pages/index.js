import anime from 'animejs';
import React from 'react';

import Page from 'himation/ui/components/pages';
import Pitch from 'himation/ui/components/pitch';
import routes from 'himation/config/routes';
import Survey from 'himation/ui/components/survey';
import { guidToRoute } from 'himation/core/routing';

import 'himation/styles/survey';

const SURVEY_ID = 'survey';

const HomePage = React.createClass({

  handleRequestSurvey: function() {
    const survey = document.getElementById(SURVEY_ID);
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
        <Pitch onRequestSurvey={this.handleRequestSurvey} surveyId={SURVEY_ID} />
        <Survey formAction={submitSurvey.path} formMethod={submitSurvey.method} anchorId={SURVEY_ID} />
      </Page>
    );
  }

});

export default HomePage;
