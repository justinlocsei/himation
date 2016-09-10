import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Page from 'himation/ui/components/page';
import Recommendations from 'himation/ui/components/recommendations';
import RegistrationPitch from 'himation/ui/components/registration-pitch';
import { dismissRegistration } from 'himation/ui/actions/registration-pitch';
import { viewBasic } from 'himation/ui/actions/recommendations';

import 'himation/styles/recommendations';

let RecommendationsPage = React.createClass({

  propTypes: {
    basics: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    hasDismissedRegistration: PropTypes.bool.isRequired,
    isPitching: PropTypes.bool.isRequired,
    onDismissRegistration: PropTypes.func.isRequired,
    onViewBasic: PropTypes.func.isRequired
  },

  render: function() {
    const {
      basics,
      categories,
      hasDismissedRegistration,
      isPitching,
      onDismissRegistration,
      onViewBasic
    } = this.props;

    return (
      <Page>
        <Recommendations basics={basics} categories={categories} onViewBasic={onViewBasic} />
        <RegistrationPitch isActive={isPitching} isDismissed={hasDismissedRegistration} onDismiss={onDismissRegistration} />
      </Page>
    );
  }

});

function mapStateToProps(state) {
  const { recommendations, registrationPitch } = state;

  return {
    basics: recommendations.basics,
    categories: recommendations.categories,
    hasDismissedRegistration: registrationPitch.isDismissed,
    isPitching: registrationPitch.isActive
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDismissRegistration: function() {
      dispatch(dismissRegistration());
    },
    onViewBasic: function(slug) {
      dispatch(viewBasic(slug));
    }
  };
}

RecommendationsPage = connect(mapStateToProps, mapDispatchToProps)(RecommendationsPage);

export default RecommendationsPage;
