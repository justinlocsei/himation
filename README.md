# Himation

This repository holds the code for the user-facing components of Cover Your
Basics.  This includes a simple express server that communicates with the Chiton
API, React-based UI code, and a webpack build process, managed by gulp, that
ties the two together.

# Development

To create the development environment for Himation, you will need a working
installation of Ruby and Node.js that match the versions defined in
`.ruby-version` and `.nvmrc`, respectively.

Once these programs are installed, run the following commands to install all
dependencies:

* `bundle install`
* `npm install`
* `npm run link`

With the dependencies installed, you can now define the environment settings.

## Settings

In order to work on Himation in development, you will need to create a settings
file at `config/settings.json`.  The available settings and their defaults,
expressed as JavaScript that maps directly to JSON, are as follows:

```javascript
{
  "assets": {
    "debug": false,   // Setting this to true will add debugging information to asset builds
    "optimize": false // Setting this to true will compress and optimize all assets during build
  },
  "server": {
    "debugLogging": false // Setting this to true will log all requests made to the app server
  },
  "servers": {
    "app": {
      "host": "localhost", // The hostname on which the app server will listen
      "path": "/",         // The root URL for the app server
      "port": 80,          // The port on which the app server will listen
      "protocol": "http"   // The protocol used to handle application requests
    },
    "assets": {
      "host": "localhost", // The hostname for the asset server
      "path": "/",         // The root URL for the asset server
      "port": 80,          // The port for the asset server
      "protocol": "http"   // The protocol used for the asset server
    }
  }
}
```
