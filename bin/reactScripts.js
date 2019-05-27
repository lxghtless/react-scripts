#!/usr/bin/env node
'use strict';

const meow = require('meow');
const chalk = require('chalk');
const ora = require('ora');
const cleanStack = require('clean-stack');

const cli = meow(`
    Usage
      $ reactScripts <input>
 
    Options
      --start, -s  Start app
      --build, -b  Build app
      --lint, -l.  Lint app

    Examples
	$ reactScripts --start
	✔ pre compile complete
	✔ app launched 🚀
	✔ compile complete 🍕 🍺
`, {
	flags: {
		start: {
			type: 'boolean',
			alias: 's'
		},
		build: {
			type: 'boolean',
			alias: 's'
		},
		lint: {
			type: 'boolean',
			alias: 's'
		}
	}
});

const availableScripts = ['start', 'build', 'lint'];

(async () => {
	const display = ora(chalk.blueBright('resolving script')).start();

	const {input, flags} = cli;

	let script;

	if (input[0]) {
		script = input[0];
	}

	if (!script) {
		if (flags.start) {
			script = 'start';
		} else if (flags.build) {
			script = 'build';
		} else if (flags.lint) {
			script = 'lint';
		}
	}

	if (!script) {
		display.fail(chalk.redBright('unable to resolve script'));
		return;
	}

	if (!availableScripts.includes(script)) {
		display.fail(chalk.redBright(`unknown script: ${script}`));
		return;
	}

	if (script === 'lint') {
		script = 'runXo';
	}

	const scriptPath = require.resolve(`../scripts/${script}.js`);

	display.info(chalk.gray(`${script} located`));

	try {
		const action = require(scriptPath);

		await action();
	} catch (error) {
		display.fail((error.stack ? cleanStack(error.stack) : error));
	}
})();
