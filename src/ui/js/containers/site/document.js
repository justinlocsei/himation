import React, { PropTypes } from 'react';

const Document = React.createClass({

  propTypes: {
    assets: PropTypes.shape({
      javascripts: PropTypes.arrayOf(PropTypes.string),
      stylesheets: PropTypes.arrayOf(PropTypes.string)
    }),
    content: PropTypes.string.isRequired,
    contentId: PropTypes.string.isRequired,
    stateVariableName: PropTypes.string.isRequired,
    store: PropTypes.object,
    title: PropTypes.string
  },

  getDefaultProps: function() {
    return {
      assets: {
        javascripts: [],
        stylesheets: []
      }
    };
  },

  render: function() {
    const { assets, content, contentId, title } = this.props;

    const titleParts = ['Cover Your Basics'];
    if (title) {
      titleParts.push(title);
    }

    let cssTags, jsTags;
    if (assets.stylesheets) {
      cssTags = assets.stylesheets.map(url => <link rel="stylesheet" href={url} />);
    }
    if (assets.javascripts) {
      jsTags = assets.javascripts.map(url => <script src={url} />);
    }

    return (
      <html lang="en">

        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <title>{titleParts.join(' - ')}</title>

          {cssTags}
        </head>

        <body className="l--app">
          <div className="l--app__content" id={contentId} dangerouslySetInnerHTML={{__html: content}}/>
          <script dangerouslySetInnerHTML={this._exposeReduxState()} />

          {jsTags}
        </body>

      </html>
    );
  },

  /**
   * Produce JavaScript that exposes the Redux store state as a global variable
   *
   * @returns {object} Data that be used to dangerously set the HTML of a script tag
   */
  _exposeReduxState: function() {
    const { stateVariableName, store } = this.props;

    const markup = `window['${stateVariableName}'] = ${JSON.stringify(store)};`;
    return {__html: markup};
  }

});

export default Document;
