# Acurast Docs

Acurast Docs is built using [Docusaurus 3](https://docusaurus.io/). It needs Node.js 20 or newer and Yarn 1.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

The build fails on broken links, anchors, images and duplicate routes.

### Typecheck

```
$ yarn process-predefined-methods && yarn typecheck
```
