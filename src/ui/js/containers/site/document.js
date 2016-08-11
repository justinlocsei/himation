import React, { PropTypes } from 'react';

import favicon from 'himation/images/branding/favicon.ico';

// This global variable is replaced at build time with the Google Analytics ID
const GOOGLE_ANALYTICS_ID = HIMATION_GOOGLE_ANALYTICS_ID;

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
      cssTags = assets.stylesheets.map(function(url, i) {
        return <link rel="stylesheet" href={url} key={i} />;
      });
    }
    if (assets.javascripts) {
      jsTags = assets.javascripts.map(function(url, i) {
        return <script src={url} key={i} />;
      });
    }

    return (
      <html lang="en">

        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <title>{titleParts.join(' - ')}</title>

          {cssTags}

          <link rel="shortcut icon" href={favicon} />
        </head>

        <body className="l--app">
          <div className="l--app__content" id={contentId} dangerouslySetInnerHTML={{__html: content}}/>
          <script dangerouslySetInnerHTML={this._exposeReduxState()} />

          {jsTags}

          <script dangerouslySetInnerHTML={this._addGoogleAnalyticsTracking()} />
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
  },

  /**
   * Product JavaScript that loads Google Analytics
   *
   * @returns {object} Data that be used to dangerously set the HTML of a script tag
   */
  _addGoogleAnalyticsTracking: function() {
    const script = `
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', '${GOOGLE_ANALYTICS_ID}', 'auto');
      ga('send', 'pageview');
    `;

    return {__html: script};
  }

});

export default Document;
