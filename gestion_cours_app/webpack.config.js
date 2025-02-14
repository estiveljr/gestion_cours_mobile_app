const webpack = require("@nativescript/webpack");

module.exports = (env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack

	const config = webpack.resolveConfig();
	
	// Add polyfills and fallbacks for Node.js core modules
	config.resolve = config.resolve || {};
	config.resolve.fallback = {
		...config.resolve.fallback,
		"stream": false,
		"assert": false,
		"https": false,
		"http": false,
		"os": false,
		"tty": false,
		"url": false,
		"buffer": false,
		"zlib": false
	};

	return config;
};
