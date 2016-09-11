import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Page from 'himation/ui/components/page';
import Recommendations from 'himation/ui/components/recommendations';
import RegistrationPitch from 'himation/ui/components/registration-pitch';
import { banishRegistration, dismissRegistration } from 'himation/ui/actions/registration-pitch';
import { viewBasic } from 'himation/ui/actions/recommendations';

import 'himation/styles/recommendations';

let RecommendationsPage = React.createClass({

  propTypes: {
    basics: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    hasBanishedRegistration: PropTypes.bool.isRequired,
    hasCompletedRegistration: PropTypes.bool.isRequired,
    isPitching: PropTypes.bool.isRequired,
    onBanishRegistration: PropTypes.func.isRequired,
    onDismissRegistration: PropTypes.func.isRequired,
    onViewBasic: PropTypes.func.isRequired
  },

  render: function() {
    const {
      basics,
      categories,
      hasBanishedRegistration,
      hasCompletedRegistration,
      isPitching,
      onBanishRegistration,
      onDismissRegistration,
      onViewBasic
    } = this.props;

    let pitchTag;
    if (!hasBanishedRegistration) {
      pitchTag = (
        <RegistrationPitch
          isActive={isPitching}
          isComplete={hasCompletedRegistration}
          onBanish={onBanishRegistration}
          onDismiss={onDismissRegistration}
        />
      );
    }

    return (
      <Page slug="recommendations">
        <Recommendations
          basics={basics}
          categories={categories}
          onViewBasic={onViewBasic}
          isStatic={true}
        />
        {pitchTag}
      </Page>
    );
  }

});

function mapStateToProps(state) {
  const { recommendations, registrationPitch } = state;

  return {
    basics: recommendations.basics,
    categories: recommendations.categories,
    hasBanishedRegistration: registrationPitch.isBanished,
    hasCompletedRegistration: registrationPitch.isComplete,
    isPitching: registrationPitch.isActive
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onBanishRegistration: function() {
      dispatch(banishRegistration());
    },
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
