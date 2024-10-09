const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtraxtPlugin = require('mini-css-extract-plugin')
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode: 'development',
	entry: './script.js',
	output: {
		filename: '[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
		extensions: ['.js', '.json'],
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	devServer: {
		port: 8080,
		hot: true,
		liveReload: true,
	},
	plugins: [
		new HTMLWebpackPlugin({
			template: './index.html'
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtraxtPlugin({
			filename: '[name].[contenthash].css',
		}),
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [{ loader: MiniCssExtraxtPlugin.loader, options: {}, }, 'css-loader']
			},
			{
				test: /\.s[ac]ss$/,
				use: [{
					loader: MiniCssExtraxtPlugin.loader, options: {
					}
				}, 'css-loader', "sass-loader"]
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif|ogg|mp3|wav)$/,
				type: 'asset/resource',
				generator: {
					filename: () => {
						return isDev ? 'iassets/[name][ext]' : 'assets/[name].[contenthash][ext]';
					}
				}
			},
		]
	}
}
