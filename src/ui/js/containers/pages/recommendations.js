import React from 'react';

import Page from 'himation/ui/js/components/pages';
import Site from 'himation/ui/js/containers/site';

const RecommendationsPage = React.createClass({

  render: function() {
    return (
      <Site>
        <Page title="Recommendations">
          <p>Recommendations page</p>
        </Page>
      </Site>
    );
  }

});

export default RecommendationsPage;
