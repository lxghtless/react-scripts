#!/usr/bin/env node
'use strict';

const meow = require('meow');
const chalk = require('chalk');
const ora = require('ora');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const cleanStack = require('clean-stack');
const restoreCursor = require('restore-cursor');
const devServerConfig = require('./devServer.config');
const webpackConfig = require('./webpack.config.js');
const openBrowser = require('./openBrowser');
const settingsFactory = require('./settingsFactory');

restoreCursor();

let display;

// eslint-disable-next-line no-unused-vars
const beforeCompile = (app, server) => {
	display.text = chalk.whiteBright('pre compile started');
	display = display.succeed(chalk.magentaBright('pre compile complete'));
	display.start();
};

const start = () => {
	display = ora(chalk.blueBright('starting dev server')).start();

	try {
		const settings = settingsFactory();
		const {devServer: devServerSettings, open: openSettings} = settings;

		const compiler = webpack(webpackConfig('development', settings));

		compiler.hooks.invalid.tap('invalid', () => {
			display.text = chalk.blueBright('compiling 🔧');
			display.start();
		});

		compiler.hooks.done.tap('done', async stats => {
			const jsonStats = stats.toJson({all: true});

			if (jsonStats.errors.length !== 0) {
				const errorMsg = jsonStats.errors.join('\n');
				display = display.fail(chalk.redBright(`failed to compile:\n${errorMsg}`));
				return;
			}

			if (jsonStats.warnings.length !== 0) {
				const warningMsg = jsonStats.warnings.join('\n');
				display = display.warn(chalk.redBright(`compile complete with warnings:\n${warningMsg}`));
				return;
			}

			display = display.succeed(chalk.greenBright('compile complete 🍕 🍺'));
		});

		const devServer = new WebpackDevServer(compiler, devServerConfig(beforeCompile));

		const {port: devServerPort, host: devServerHost} = devServerSettings;

		devServer.listen(devServerPort, devServerHost, error => {
			if (error) {
				let errorMsg;
				if (error.stack) {
					errorMsg = cleanStack(error);
				} else {
					errorMsg = error;
				}

				display = display.fail(chalk.redBright(`failed to start dev server: ${errorMsg}`));
				return;
			}

			display.text = chalk.blueBright('launching app');

			const {scheme: openScheme, port: openPort, host: openHost} = openSettings;

			const openUrl = `${openScheme}://${openHost}:${openPort}/`;

			openBrowser(openUrl)
				// eslint-disable-next-line promise/prefer-await-to-then
				.then(opened => {
					if (opened) {
						display = display.succeed(chalk.blueBright('app launched 🚀'));
						return;
					}

					display = display.fail(chalk.redBright('failed to open browser'));
				})
				.catch(error2 => {
					if (error2) {
						let errorMsg;
						if (error2.stack) {
							errorMsg = cleanStack(error2);
						} else {
							errorMsg = error2;
						}

						display = display.fail(chalk.redBright(`failed to open browser: ${errorMsg}`));
					}
				});
		});

		['SIGINT', 'SIGTERM'].forEach(sig => {
			process.on(sig, () => {
				display.text = chalk.blueBright('stopping dev server 📟');
				display.start();
				devServer.close();
				display = display.succeed(chalk.blueBright('dev server stopped 🖥️'));
				process.exit();
			});
		});

		return true;
	} catch (_) {}

	return false;
};

module.exports = start;

const cli = meow(`
    Usage
      $ start <flags>
 
    Options
      --app, -a  start app in dev mode

    Examples
	$ start --app
`, {
	flags: {
		app: {
			type: 'boolean',
			alias: 'a'
		}
	}
});

(() => {
	const {flags} = cli;
	const {app} = flags;

	if (!app) {
		return;
	}

	start();
})();
