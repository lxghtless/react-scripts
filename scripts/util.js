const rimraf = require('rimraf');
const chalk = require('chalk');

const xoHeart = '❤️';
const xoBrokenHeart = '💔';

const pRimraf = (...args) => {
	return new Promise((resolve, reject) => {
		rimraf(...args, error => {
			if (error) {
				return reject(error);
			}

			resolve();
		});
	});
};

const toXoDisplayMessage = ({message, success, exitCode, xoCliPath}) => {
	if (success !== true) {
		const fmtMsg = `${xoBrokenHeart}\nmessage: ${message}\nexitCode: ${exitCode}\nsuccess: ${success}\nxoCliPath: ${xoCliPath}`;
		return chalk.red(fmtMsg);
	}

	if (!message) {
		return chalk.white(`${xoHeart}`);
	}

	return chalk.yellow(`${xoHeart}\n${message}`);
};

module.exports = {
	pRimraf,
	toXoDisplayMessage
};
