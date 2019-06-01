const path = require('path');
const fs = require('fs-extra');

const defaultPort = 8080;
const defaultHost = 'localhost';

const defaultSettings = {
	devServer: {
		port: defaultPort,
		host: defaultHost
	},
	open: {
		scheme: 'http',
		port: defaultPort,
		host: defaultHost
	},
	flow: true,
	babelResolver: {
		root: ['./src', './assets'],
		alias: {}
	}
};

const getCwdPackageJson = () => {
	const cwd = process.cwd();
	const pkgPath = path.join(cwd, 'package.json');
	return fs.readJsonSync(pkgPath);
};

const getScriptSetings = () => {
	const pckJson = getCwdPackageJson();
	const settingsNodeName = 'react-scripts';
	if (pckJson[settingsNodeName]) {
		return Object.assign(defaultSettings, pckJson[settingsNodeName]);
	}

	return defaultSettings;
};

module.exports = getScriptSetings;
