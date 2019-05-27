const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveContentBase = relativePath => path.resolve(appDirectory, relativePath);

module.exports = beforeCompile => ({
	contentBase: resolveContentBase('public'),
	watchContentBase: true,
	compress: true,
	clientLogLevel: 'none',
	quiet: true,
	overlay: false,
	hot: true,
	watchOptions: {
		aggregateTimeout: 600,
		ignored: ['node_modules', 'scripts']
	},
	historyApiFallback: {
		disableDotRule: true
	},
	before: beforeCompile
});
