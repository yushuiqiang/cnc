/* eslint no-var: 0 */
var path = require('path');
var webpack = require('webpack');
var WebpackMd5HashPlugin = require('webpack-md5-hash');
var ManifestPlugin = require('webpack-manifest-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var InlineChunkWebpackPlugin = require('html-webpack-inline-chunk-plugin');
var baseConfig = require('./webpack.config.base');
var pkg = require('./package.json');

var webpackConfig = Object.assign({}, baseConfig, {
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'dist/cnc/web'),
        chunkFilename: '[name].[chunkhash].bundle.js',
        filename: '[name].[chunkhash].bundle.js',
        publicPath: '/'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                // This has effect on the react lib size
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            // The order matters, the order should be reversed just like loader chain.
            // https://github.com/webpack/webpack/issues/1016
            names: ['vendor', 'polyfill', 'manifest'],
            filename: '[name].[chunkhash].js',
            minChunks: Infinity
        }),
        new WebpackMd5HashPlugin(),
        // Generates a manifest.json file in your root output directory with a mapping of all source file names to their corresponding output file.
        new ManifestPlugin({
            fileName: 'manifest.json'
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                screw_ie8: true, // React doesn't support IE8
                warnings: false
            },
            mangle: {
                screw_ie8: true
            },
            output: {
                comments: false,
                screw_ie8: true
            }
        }),
        new HtmlWebpackPlugin({
            title: `cnc v${pkg.version}`,
            filename: 'index.hbs',
            template: path.resolve(__dirname, 'src/web/assets/index.hbs'),
            chunksSortMode: 'dependency' // Sort chunks by dependency
        }),
        new InlineChunkWebpackPlugin({
            inlineChunks: ['manifest']
        }),
        new webpack.NoErrorsPlugin()
    ]
});

module.exports = webpackConfig;
