#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');
const meow = require('meow');
const chalk = require('chalk');
const ora = require('ora');
const execa = require('execa');
const {toXoDisplayMessage} = require('./util');

const cwd = process.cwd();
const isFile = p => fs.existsSync(p);
const makePath = (...parts) => path.join(...parts);
const aboveHere = here => path.dirname(here);

const xoHeart = '❤️';
const xoBrokenHeart = '💔';

const defaultOptions = {
	src: 'src',
	glob: `${path.sep}**${path.sep}*.js`
};

const closestNodeModulesFolder = () => {
	return makePath(aboveHere(__dirname), 'node_modules');
};

const resolveXoCliPath = () => {
	return makePath(closestNodeModulesFolder(), 'xo', 'cli.js');
};

async function runXo({src, glob, fix} = defaultOptions) {
	try {
		const xoArgs = `${path.join(cwd, src)}${glob}${(fix ? ' --fix' : '')}`;
		const xoCliPath = resolveXoCliPath();

		if (isFile(xoCliPath)) {
			const {stdout} = await execa('node', [xoCliPath, xoArgs], {
				env: {
					NODE_PATH: closestNodeModulesFolder()
				}
			});
			return {
				message: stdout,
				success: true,
				exitCode: 0
			};
		}

		return {
			message: 'unable to locate xo cli',
			success: false
		};
	} catch (error) {
		const {exitCode, stdout} = error;
		return {
			message: `${(stdout || stdout)}`,
			success: (exitCode === 0),
			exitCode: (exitCode || 1)
		};
	}
}

async function runXoAsCli(options = defaultOptions) {
	let display;
	try {
		const {fix} = options;
		display = ora(chalk.whiteBright(`running xo ${xoHeart}`)).start();
		const result = await runXo(Object.assign(options, {
			fix
		}));

		const {success} = result;
		const xoMessage = toXoDisplayMessage(result);

		if (success !== true) {
			display.fail(xoMessage);
			return;
		}

		display.succeed(xoMessage);
	} catch (error) {
		display.fail(`fatal error when running xo ${xoBrokenHeart}`);
		throw (error);
	}
}

runXoAsCli.runXo = runXo.bind(runXoAsCli);

module.exports = runXoAsCli;

const cli = meow(`
    Usage
      $ runXo <flags>
 
    Options
      --app, -a  run xo against app src
      --fix, -f  add --fix to xo cmd

    Examples
	$ runXo --fix --app
	✔ xo ${xoHeart}
`, {
	flags: {
		app: {
			type: 'boolean',
			alias: 'a'
		},
		fix: {
			type: 'boolean',
			alias: 'f'
		}
	}
});

(async () => {
	const {flags} = cli;
	const {app, fix} = flags;

	if (!app) {
		return;
	}

	await runXoAsCli(Object.assign(defaultOptions, {
		fix
	}));
})();
