const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const paths = require('./paths');
const ESLintPlugin = require('eslint-webpack-plugin');

process.env.NODE_ENV = "production";

module.exports = {
    mode: 'production',
    bail: true,
    devtool: false,
    optimization: {
        minimize: false,
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.tsx', 'jsx']
    },
    performance: false,
    entry: {
        popup: [require.resolve('./polyfills'), path.resolve(paths.appSrc, 'entry', 'popup')],
        content: [require.resolve('./polyfills'), path.resolve(paths.appSrc, 'entry', 'content')],
        background: [path.resolve(paths.appSrc, 'entry', 'background')],
        options:  [require.resolve('./polyfills'), path.resolve(paths.appSrc, 'entry', 'options')],
        separate: [require.resolve('./polyfills'), path.resolve(paths.appSrc, 'entry', 'separate')],
        audio: [require.resolve('./polyfills'), path.resolve(paths.appSrc, 'entry', 'audio')]
    },
    output: {
        path: paths.appBuild,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                oneOf: [
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
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
                    // {
                    //     loader: require.resolve('file-loader'),
                    //     exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
                    //     options: {
                    //         name: 'static/media/[name].[hash:8].[ext]',
                    //     },
                    // },
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: paths.appPublic,
                    to: paths.appBuild,
                    filter: (path) => {
                        return !/popup|options|separate|audio\.html/.test(path);
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
            template: path.resolve(paths.appPublic, 'audio.html'),
            chunks: ['audio'],
            filename: 'audio.html',
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
