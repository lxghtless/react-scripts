#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');
const meow = require('meow');
const chalk = require('chalk');
const ora = require('ora');
const execa = require('execa');
const cleanStack = require('clean-stack');
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

const closestNodeModulesFolder = fromDir => {
	return makePath(aboveHere(fromDir), 'node_modules');
};

const resolveXoCliPath = (fromDir = __dirname) => {
	const nodeModulesPath = closestNodeModulesFolder(fromDir);
	const cliPath = makePath(nodeModulesPath, 'xo', 'cli.js');
	if (isFile(cliPath)) {
		return {
			nodeModulesPath,
			cliPath
		};
	}

	const aboveFrom = aboveHere(fromDir);

	return resolveXoCliPath(aboveFrom);
};

async function runXo({src, glob, fix} = defaultOptions) {
	let xoCliPath;
	try {
		const xoArgs = `${path.join(cwd, src)}${glob}${(fix ? ' --fix' : '')}`;
		const {cliPath, nodeModulesPath} = resolveXoCliPath();
		xoCliPath = cliPath;

		const {stdout} = await execa('node', [xoCliPath, xoArgs], {
			env: {
				NODE_PATH: nodeModulesPath
			}
		});

		return {
			message: stdout,
			success: true,
			exitCode: 0,
			xoCliPath
		};
	} catch (error) {
		const {exitCode, stdout, stderr} = error;
		return {
			message: `${(stdout || stderr || cleanStack(error.stack))}`,
			success: (exitCode === 0),
			exitCode: (exitCode || 1),
			xoCliPath
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
