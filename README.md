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
file at `config/settings.json`.  The following settings are available, with
the dot-based hierarchy converted to nested JSON data.

### `assets.debug`

Setting this to `true` will add debugging information to asset builds.

### `assets.optimize`

Setting this to `true` will compress and optimize all built assets.

### `server.debugLogging`

Setting this to `true` will show log messages when development server requests
are received.

### `server.app.host`

The host of the application server.

### `server.app.port`

The numerical port for the application server.

### `server.app.protocol`

The network protocol for the application server.

### `server.assets.host`

The host for the asset server.

### `server.assets.port`

The numerical port for the asset server.

### `server.assets.protocol`

The network protocol for the asset server.
