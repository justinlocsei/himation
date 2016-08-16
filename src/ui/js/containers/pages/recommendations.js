import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Page from 'himation/ui/components/pages';
import Recommendations from 'himation/ui/components/recommendations';

import 'himation/styles/recommendations';

let RecommendationsPage = React.createClass({

  propTypes: {
    basics: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired
  },

  render: function() {
    return (
      <Page>
        <Recommendations {...this.props} />
      </Page>
    );
  }

});

function mapStateToProps(state) {
  const { recommendations } = state;

  return {
    basics: recommendations.basics,
    categories: recommendations.categories
  };
}

RecommendationsPage = connect(mapStateToProps)(RecommendationsPage);

export default RecommendationsPage;
