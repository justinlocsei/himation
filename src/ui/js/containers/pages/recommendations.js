import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Page from 'himation/ui/components/page';
import Recommendations from 'himation/ui/components/recommendations';
import { viewBasic } from 'himation/ui/actions/pitch';

import 'himation/styles/recommendations';

let RecommendationsPage = React.createClass({

  propTypes: {
    basics: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    hasDismissedRegistration: PropTypes.bool.isRequired,
    isPitching: PropTypes.bool.isRequired
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
  const { recommendations, pitch } = state;

  return {
    basics: recommendations.basics,
    categories: recommendations.categories,
    hasDismissedRegistration: pitch.isDismissed,
    isPitching: pitch.isActive
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDismissRegistration: function() {

    },
    onViewBasic: function(slug) {
      dispatch(viewBasic(slug));
    }
  };
}

RecommendationsPage = connect(mapStateToProps, mapDispatchToProps)(RecommendationsPage);

export default RecommendationsPage;
