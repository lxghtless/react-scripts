<h3 align="center">
  @lxghtless/react-scripts
</h3>

<p align="center">
  scripts for developing, linting, building and testing react apps
</p>

<p align="center">
  <a href="https://github.com/xojs/xo"><img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg"></a>
</p>

## Install

```shell
$ npm install @lxghtless/react-scripts
```

## Usage

```json
{
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "lint": "react-scripts lint"
    }
}
```

## HtmlWebpackPlugin & ManifestPlugin

Both of these are used, so a `./public` folder needs to be in the root project directory with a template `index.html` and `manifest.json`. See the [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin) and [ManifestPlugin](https://github.com/danethurber/webpack-manifest-plugin) pages for details.

## babel-plugin-module-resolver

Configured with the following options by default.

```js
{
  root: ['./src', './assets']
}
```

Customizable through the `babelResolver` section in the react-scripts section of the package.json

```json
{
  "react-scripts": {
    "babelResolver": {
      root: ['./src', './other-src'],
      alias: {
        'submodules': './src/components/subcomp/modules'
      }
    }
  }
}
```

## XO config

example xo config in `package.json` support without needing to install any additional dependencies

```json
{
  "xo": {
    "envs": [
      "browser",
      "node"
    ],
    "extends": "xo-react",
    "plugins": [
      "unicorn",
      "react"
    ],
    "rules": {
      "unicorn/filename-case": [
        "error",
        {
          "case": "camelCase"
        }
      ],
      "import/extensions": [
        "js",
        "jsx",
        "styl",
        "png",
        "jpg",
        "svg"
      ],
      "react/prop-types": 0,
      "react/jsx-fragments": 0,
      "import/no-unassigned-import": 0,
      "capitalized-comments": 0,
      "react/self-closing-comp": 0
    },
    "settings": {
      "import/resolver": {
        "babel-module": {
          "root": [
            "./src"
          ]
        }
      }
    },
    "parser": "babel-eslint"
  }
}
```

## Flow support

To enable `@babel/preset-flow` set `flow` in the react-scripts section of the package.json to `true`

```json
{
  "react-scripts": {
    "flow": true
  }
}
```

## Example React Project package.json

<p>&#8205;</p>

> with all customizations available in the `react-scripts` section

<p>&#8205;</p>

```json
{
  "name": "react-portal",
  "version": "1.0.0",
  "description": "a react portal",
  "main": "index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "lint": "react-scripts lint"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/user_name/react-portal.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/user_name/react-portal/issues"
  },
  "homepage": "https://github.com/user_name/react-portal#readme",
  "dependencies": {
    "@lxghtless/react-scripts": "^0.3.1",
    "ky": "^0.11.0",
    "ramda": "^0.26.1",
    "react": "^16.8.6",
    "react-dom": "^16.8.6",
    "react-router-dom": "^5.0.0"
  },
  "xo": {
    "ignore": [
      "assets/**/*.*"
    ],
    "envs": [
      "browser",
      "node"
    ],
    "extends": "xo-react",
    "plugins": [
      "unicorn",
      "react"
    ],
    "rules": {
      "unicorn/filename-case": [
        "error",
        {
          "case": "camelCase"
        }
      ],
      "import/extensions": [
        "js",
        "styl",
        "css",
        "png",
        "jpg",
        "svg"
      ],
      "react/prop-types": 0,
      "react/jsx-fragments": 0,
      "import/no-unassigned-import": 0,
      "capitalized-comments": 0,
      "react/self-closing-comp": 0
    },
    "settings": {
      "import/resolver": {
        "babel-module": {
          "root": [
            "./src", "./assets"
          ]
        }
      }
    },
    "parser": "babel-eslint"
  },
  "react-scripts": {
    "devServer": {
      "port": 8080,
      "host": "localhost"
    },
    "open": {
      "scheme": "http",
      "port": 8080,
      "host": "localhost"
    },
    "flow": true,
    "babelResolver": {
      root: ['./src', './other-src'],
      alias: {
        'submodules': './src/components/subcomp/modules'
      }
    }
  }
}
```

## Run with a Makefile

`Makefile`

```yaml
build:
    @npm run --silent build

start:
    @npm run --silent start

xo:
    @npm run --silent lint

.PHONY: build start xo
```

run with make

```shell
$ make build
$ make start
$ make xo
```

## TODO

- Support style loader and preset hooks. 

## License

ISC © [lxghtlxss](https://github.com/lxghtless)
