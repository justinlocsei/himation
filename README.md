# Himation

This repository holds the code for the user-facing components of Cover Your
Basics.  This includes a simple express server that communicates with the Chiton
API, React-based UI code, and a webpack build process, managed by gulp, that
ties the two together.

## Settings

In order to run Himation, you will need to create a settings file with the
structure below, which shows the available settings and their defaults:

```javascript
{
  "assets": {
    "debug": false,   // Setting this to true will add debugging information to asset builds
    "distDir": null,  // The absolute path to the directory for final build assets
    "optimize": false // Setting this to true will compress and optimize all assets during build
  },
  "caching": {
    "gatewayUrl": null, // The URL for the gateway caching server
    "ttl": 60           // The number of seconds for which to cache cacheable content
  },
  "chiton": {
    "endpoint": null, // The URL for the root Chiton API endpoint
    "token": null     // The API token used to authenticate Chiton requests
  },
  "cookies": {
    "registered": null // The name of the registered-user cookie
  },
  "debug": false,               // Whether to enable debug tools
  "emailSenderAddress": null,   // The address of the sender of all emails
  "emailSenderName": null,      // The name of the sender of all emails
  "environment": "development", // The name of the application environment
  "errors": {
    "sentryDsn": null,       // The Sentry DSN for reporting errors
    "sentryDsnPublic": null, // The public Sentry DSN for reporting errors
    "track": false           // Whether or not to track errors
  },
  "facebookAppId": null,     // The Facebook app ID for the site
  "googleAnalyticsId": null, // The Google Analytics ID to use for tracking
  "sendgridApiKey": null,    // The SendGrid API key to use
  "server": {
    "debugLogging": false // Setting this to true will log all requests made to the app server
  },
  "servers": {
    "app": {
      "caCertificatePath": null, // The path to the certificate for the CA that signed the app server's certificate
      "host": "localhost",       // The hostname on which the app server will listen
      "path": "/",               // The root URL for the app server
      "port": 80,                // The port on which the app server will listen
      "protocol": "http",        // The protocol used to handle application requests
      "publicUrl": null          // The public URL by which the app server is accessible
    },
    "assets": {
      "caCertificatePath": null, // The path to the certificate for the CA that signed the asset server's certificate
      "host": "localhost",       // The hostname for the asset server
      "path": "/",               // The root URL for the asset server
      "port": 80,                // The port for the asset server
      "protocol": "http",        // The protocol used for the asset server
      "publicUrl": null          // The public URL by which the asset server is accessible
    }
  },
  "trackStats": false // Whether to track application stats
}
```

Once you have created this file, set its absolute path as the value of the
`HIMATION_CONFIG_FILE` environment variable.

## Development

Himation is controlled via Gulp tasks exposed as NPM scripts.  In order to work
on Himation, you must first generate asset manifests for a build by running the
following command:

```sh
$ npm run bootstrap
```

Once a build has been performed, you can start a development server by running:

```sh
$ npm run develop
```

## Deployment

To run the application server in a production environment, run the following
commands to build the assets and run the server:

```sh
$ npm run build
$ npm run serve
```
