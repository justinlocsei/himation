'use strict';

module.exports = {
  assets: {
    debug: true,
    optimize: false
  },
  debug: true,
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
  }
};
