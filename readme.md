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
    ...
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "lint": "react-scripts lint"
    },
    ...
}
```

## HtmlWebpackPlugin & ManifestPlugin

Both of these are used, so a `./public` folder needs to be in the root project directory with a template `index.html` and `manifest.json`. See the [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin) and [ManifestPlugin](https://github.com/danethurber/webpack-manifest-plugin) pages for details.

## babel-plugin-module-resolver

Configured with the following options, so assets like static css libs, fonts, etc can be referenced from outside src if wanted.

```js
{
    root: ['./src'],
    alias: {
        assets: './assets'
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
          ],
          "alias": {
            "assets": "./assets"
          }
        }
      }
    },
    "parser": "babel-eslint"
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
