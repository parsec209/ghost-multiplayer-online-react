# ghost-multiplayer-online-react

Interface for playing the classic word game Ghost against other players online. Built with React, TypeScript, Auth0, and Socket.IO. Checkout [ghost-multiplayer-online-api](https://github.com/parsec209/ghost-multiplayer-online-api) for the server-side code. Game history is stored and turns are updated in realtime with optional email alerts.

## Quick Start

### Install dependencies

```console
$ npm install
```

### Environment variables

Refer to [.sample-env](.sample-env)

### Start dev server

```console
$ npm run dev
```

### Build for production

```console
$ npm run build
```

### Hosting

See [netlify.toml](netlify.toml) for the redirect config if hosting on Netlify.

### Auth0

You will need to setup a single page application in Auth0's applications section. Details for the server-side setup can be found in the [ghost-multiplayer-online-api](https://github.com/parsec209/ghost-multiplayer-online-api) repo. Also refer to [auth0.js](auth0.js) for an example post login action that must be setup to get and set the user's metadata.

## App Info

### Author

Ryan Galbreath

### Version

1.0.0

### License

MIT
