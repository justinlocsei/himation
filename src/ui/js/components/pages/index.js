import React, { PropTypes } from 'react';

import { childProps } from 'himation/core/extensions/react';

const Page = React.createClass({

  propTypes: {
    children: childProps.multiple,
    title: PropTypes.string
  },

  render: function() {
    const { children, title } = this.props;

    let titleTag;
    if (title) {
      titleTag = <h1 className="l--page__title">{title}</h1>;
    }

    return (
      <div className="l--page">
        {titleTag}

        <main className="l--page__content">
          {children}
        </main>
      </div>
    );
  }

});

export default Page;
