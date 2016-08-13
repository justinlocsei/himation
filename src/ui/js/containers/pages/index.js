import React from 'react';

import Page from 'himation/ui/components/pages';
import routes from 'himation/config/routes';
import Survey from 'himation/ui/components/survey';
import { guidToRoute } from 'himation/core/routing';

import 'himation/styles/survey';

const SURVEY_ID = 'survey';

const HomePage = React.createClass({

  render: function() {
    const submitSurvey = guidToRoute(routes, 'himation.recommendations');

    return (
      <Page>

        <div className="l--pitch">
          <h1 className="l--pitch__tagline">
            Ladies, take the pain out of keeping your professional wardrobe
            stocked with essentials.
          </h1>
          <p className="l--pitch__details">
            We use your shape, style, and workplace formality to provide you
            with the best clothes available from a wide range of retailers.
            There’s no charge to use our site and no markup to the clothing. So
            get started now and never spend your weekend shopping for work
            clothes again.
          </p>
          <div className="l--pitch__cta">
            <a href={`#${SURVEY_ID}`} className="l--pitch__button">Fill Out Our Survey</a>
          </div>
        </div>

        <Survey formAction={submitSurvey.path} formMethod={submitSurvey.method} anchorId={SURVEY_ID} />

      </Page>
    );
  }

});

export default HomePage;
