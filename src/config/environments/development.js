'use strict';

module.exports = {
  assets: {
    debug: true,
    optimize: false
  },
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
