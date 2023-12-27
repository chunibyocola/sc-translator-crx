const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const paths = require('./paths');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env) => {
    if (env.production) {
        process.env.BABEL_ENV = 'production';
        process.env.NODE_ENV = 'production';
    }
    else if (env.development) {
        process.env.BABEL_ENV = 'development';
        process.env.NODE_ENV = 'development';
    }

    const isEnvProduction = env.production;
    const isEnvDevelopment = env.development;

    return {
        mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
        bail: true,
        devtool: false,
        optimization: {
            minimize: isEnvProduction,
            minimizer: [new TerserPlugin({
                extractComments: false,
            })],
        },
        resolve: {
            extensions: ['.ts', '.js', '.json', '.tsx', 'jsx']
        },
        performance: false,
        entry: {
            popup: [path.resolve(paths.appSrc, 'entry', 'popup')],
            content: [path.resolve(paths.appSrc, 'entry', 'content')],
            background: { import: path.resolve(paths.appSrc, 'entry', 'background'), filename: '[name].js' },
            options:  [path.resolve(paths.appSrc, 'entry', 'options')],
            separate: [path.resolve(paths.appSrc, 'entry', 'separate')],
            collection: [path.resolve(paths.appSrc, 'entry', 'collection')],
        },
        output: {
            path: paths.appBuild,
            filename: 'static/js/[name].js',
            chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
            clean: true
        },
        module: {
            strictExportPresence: true,
            rules: [
                {
                    oneOf: [
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            type: 'asset/inline',
                        },
                        {
                            test: /\.(js|jsx|mjs|tsx|ts)$/,
                            include: paths.appSrc,
                            loader: require.resolve('babel-loader'),
                            options: {
                                compact: true,
                            },
                        },
                        {
                            test: /\.css$/,
                            use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader']
                        },
                    ],
                },
            ],
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    {
                        from: paths.appPublic,
                        to: paths.appBuild,
                        filter: (path) => {
                            return !/(popup|options|separate|collection)\.html/.test(path);
                        },
                    },
                ],
            }),
            new HtmlWebpackPlugin({
                inject: true,
                template: path.resolve(paths.appPublic, 'popup.html'),
                chunks: ['popup'],
                filename: 'popup.html',
            }),
            new HtmlWebpackPlugin({
                inject: true,
                template: path.resolve(paths.appPublic, 'options.html'),
                chunks: ['options'],
                filename: 'options.html',
            }),
            new HtmlWebpackPlugin({
                inject: true,
                template: path.resolve(paths.appPublic, 'separate.html'),
                chunks: ['separate'],
                filename: 'separate.html',
            }),
            new HtmlWebpackPlugin({
                inject: true,
                template: path.resolve(paths.appPublic, 'collection.html'),
                chunks: ['collection'],
                filename: 'collection.html',
            }),
            new MiniCssExtractPlugin({
                filename: 'static/css/[name].css'
            }),
            new ESLintPlugin({
                extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
                eslintPath: require.resolve('eslint'),
                context: paths.appSrc,
            }),
        ],
        node: false,
    };
};
