const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isProduction = webpackenv => webpackenv === 'production';
const isDevelopment = webpackenv => webpackenv === 'development';

const cwd = process.cwd();

const manifest = require(path.join(cwd, 'public', 'manifest.json'));
const htmlTemplate = path.join(cwd, 'public', 'index.html');

const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';

module.exports = webpackenv => ({
	mode: isProduction(webpackenv) ? 'production' : isDevelopment(webpackenv) && 'development',
	entry: './src/index.js',
	output: {
		path: isProduction(webpackenv) ? path.join(cwd, 'build') : undefined,
		pathinfo: isDevelopment(webpackenv),
		filename: isProduction(webpackenv) ?
			'static/js/[name].[contenthash:8].js' :
			isDevelopment(webpackenv) && 'static/js/bundle.js',
		futureEmitAssets: true,
		chunkFilename: isProduction(webpackenv) ?
			'static/js/[name].[contenthash:8].chunk.js' :
			isDevelopment(webpackenv) && 'static/js/[name].chunk.js',
		publicPath: PUBLIC_PATH
	},
	optimization: {
		minimize: isProduction(webpackenv),
		minimizer: [new TerserPlugin({
			terserOptions: {
				parse: {
					ecma: 8
				},
				compress: {
					ecma: 5,
					warnings: false,
					comparisons: false,
					inline: 2
				},
				mangle: {
					safari10: true
				},
				output: {
					ecma: 5,
					comments: false,
					// eslint-disable-next-line camelcase
					ascii_only: false
				}
			}
		})]
	},
	module: {
		rules: [
			{
				test: /\.(js|mjs|jsx|ts|tsx)$/,
				exclude: /node_modules/,
				use: {
					loader: require.resolve('babel-loader'),
					options: {
						babelrc: false,
						configFile: false,
						compact: false,
						// TODO: provide hook to add presets (i.e. merge in .babelrc from cwd or something like that)
						presets: [
							require.resolve('@babel/preset-env'),
							require.resolve('@babel/preset-react'),
							{
								sourceType: 'unambiguous',
								plugins: [
									[
										require('@babel/plugin-transform-destructuring').default,
										{
											loose: false,
											selectiveLoose: [
												'useState',
												'useEffect',
												'useContext',
												'useReducer',
												'useCallback',
												'useMemo',
												'useRef',
												'useImperativeHandle',
												'useLayoutEffect',
												'useDebugValue'
											]
										}
									]
								]
							},
							{
								sourceType: 'unambiguous',
								plugins: [
									[
										require('@babel/plugin-transform-runtime').default,
										{
											corejs: false,
											helpers: true,
											regenerator: true
										}
									]
								]
							},
							{
								sourceType: 'unambiguous',
								plugins: [require.resolve('@babel/plugin-proposal-class-properties')]
							},
							{
								sourceType: 'unambiguous',
								plugins: [require.resolve('@babel/plugin-syntax-export-default-from')]
							},
							{
								sourceType: 'unambiguous',
								plugins: [
									[
										require('babel-plugin-module-resolver'),
										{
											// TODO: provide a hook to customize these settings
											root: ['./src'],
											alias: {
												assets: './assets'
											}
										}
									]
								]
							}
						],
						cacheDirectory: true,
						cacheCompression: isProduction(webpackenv),
						sourceMaps: false
					}
				}
			},
			// TODO: provide a hook to add in more style loaders
			{
				test: /\.styl$/,
				exclude: /node_modules/,
				use: [{
					loader: require.resolve('style-loader')
				},
				{
					loader: require.resolve('css-loader')
				},
				{
					loader: require.resolve('stylus-loader'),
					options: {
						sourceMap: isProduction(webpackenv)
					}
				}]
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [{
					loader: require.resolve('style-loader')
				},
				{
					loader: require.resolve('css-loader')
				}]
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					require.resolve('file-loader')
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					require.resolve('file-loader')
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin(
			{

				title: manifest.short_name,
				inject: true,
				template: htmlTemplate,
				...(isProduction(webpackenv) ?
					{
						minify: {
							removeComments: true,
							collapseWhitespace: true,
							removeRedundantAttributes: true,
							useShortDoctype: true,
							removeEmptyAttributes: true,
							removeStyleLinkTypeAttributes: true,
							keepClosingSlash: true,
							minifyJS: true,
							minifyCSS: true,
							minifyURLs: true
						}
					} :
					undefined)
			}
		),
		new ManifestPlugin()
	]
});
