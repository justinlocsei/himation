import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Page from 'himation/ui/js/components/pages';
import Recommendations from 'himation/ui/js/components/recommendations';

import 'himation/ui/scss/recommendations';

let RecommendationsPage = React.createClass({

  propTypes: {
    basics: PropTypes.array.isRequired
  },

  render: function() {
    return (
      <Page title="Your Recommendations">
        <Recommendations basics={this.props.basics} />
      </Page>
    );
  }

});

function mapStateToProps(state) {
  return {
    basics: state.recommendations
  };
}

RecommendationsPage = connect(mapStateToProps)(RecommendationsPage);

export default RecommendationsPage;
