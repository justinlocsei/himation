'use strict';

module.exports = {
  servers: {
    app: {
      host: 'localhost',
      port: 8080,
      protocol: 'http'
    },
    assets: {
      host: 'localhost',
      port: 8081,
      protocol: 'http'
    }
  },
  webpack: {
    debug: false,
    optimize: true
  }
};
