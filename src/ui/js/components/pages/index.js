import React, { PropTypes } from 'react';

const Page = React.createClass({

  propTypes: {
    children: PropTypes.element,
    title: PropTypes.string.isRequired
  },

  render: function() {
    const { children, title } = this.props;

    return (
      <div className="l--page">

        <h2 className="l--page__title">{title}</h2>

        <div className="l--page__content">
          {children}
        </div>
      </div>
    );
  }

});

export default Page;
