const {execSync} = require('child_process');
const open = require('open');

const openOptions = () => {
	const browser = process.env.BROWSER;
	const OSX_CHROME = 'google chrome';
	const appleScript = process.platform === 'darwin' &&
(typeof browser !== 'string' || browser === OSX_CHROME);
	return {
		browser,
		appleScript
	};
};

const start = async url => {
	let {browser, appleScript} = openOptions();

	if (appleScript) {
		try {
			execSync('ps cax | grep "Google Chrome"');
			execSync('osascript openChrome.applescript "' + encodeURI(url) + '"', {
				cwd: __dirname,
				stdio: 'ignore'
			});
			return true;
		} catch (_) {
			return false;
		}
	}

	if (process.platform === 'darwin' && browser === 'open') {
		browser = undefined;
	}

	const options = {app: browser, wait: false};
	await open(url, options);
	return true;
};

module.exports = start;
