#!/usr/bin/env node
'use strict';

const webpack = require('webpack');
const meow = require('meow');
const chalk = require('chalk');
const ora = require('ora');
const restoreCursor = require('restore-cursor');
const cleanStack = require('clean-stack');
const prettyjson = require('prettyjson');
const prettyMs = require('pretty-ms');
const prettyBytes = require('pretty-bytes');

const webpackConfigFactory = require('./webpack.config.js');
const {runXo} = require('./runXo');
const {pRimraf, toXoDisplayMessage} = require('./util');
const settingsFactory = require('./settingsFactory');

restoreCursor();

const xoHeart = '❤️';

const compile = () => {
	const settings = settingsFactory();
	const webpackConfig = webpackConfigFactory('production', settings);
	const compiler = webpack(webpackConfig);

	return new Promise((resolve, reject) => {
		compiler.run((error, stats) => {
			const messages = {};

			if (error) {
				if (!error.message) {
					return reject(error);
				}

				messages.error = cleanStack(error.stack);
			} else {
				const {errors, warnings} = stats.toJson({all: false, warnings: true, errors: true});
				if (errors.length > 0) {
					messages.error = prettyjson.render({errors, warnings});
				} else if (warnings.length > 0) {
					messages.warning = prettyjson.render({warnings});
				}
			}

			if (messages.error) {
				return reject(new Error(messages.error));
			}

			return resolve({
				stats,
				warning: messages.warning
			});
		});
	});
};

const build = async () => {
	let display = ora(chalk.blueBright('starting build')).start();

	try {
		display.text = chalk.whiteBright(`running xo ${xoHeart}`);

		const result = await runXo();

		const {success} = result;
		const xoMessage = toXoDisplayMessage(result);

		if (success !== true) {
			display.fail(xoMessage);
			return;
		}

		display.info(xoMessage);

		display.start();

		display.text = 'cleaning up 🚿';

		await pRimraf('build/**/*.*');
		display = display.info(chalk.blueBright('ready to build 🦄'));

		display.start();

		display.color = 'blue';
		display.text = chalk.blueBright('building 🔧');

		const {stats, warning} = await compile();

		const statsJson = stats.toJson({all: true});

		if (warning) {
			display = display.warn(chalk.yellow(warning));
			display.start();
		}

		display = display.succeed(chalk.greenBright('build complete 🍕 🍺'));

		const time = prettyMs(statsJson.time);
		const builtAt = (new Date(statsJson.builtAt).toLocaleString());
		const {assets, chunks, modules, outputPath, publicPath} = statsJson;

		let buildSize = 0;

		for (const {size} of assets) {
			buildSize += size;
		}

		display.info('\n' + chalk.gray(prettyjson.render({
			message: 'webpack stats',
			builtAt,
			time,
			buildSize: prettyBytes(buildSize),
			publicPath,
			outputPath,
			chunks: chunks.length,
			modules: modules.length
		}, {noColor: true})));
		return true;
	} catch (error) {
		display.fail(chalk.redBright(error.stack ? cleanStack(error.stack) : error));
	}

	return false;
};

module.exports = build;

const cli = meow(`
    Usage
      $ build <flags>
 
    Options
      --app, -a  build app for production

    Examples
	$ build --app
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

	build();
})();

