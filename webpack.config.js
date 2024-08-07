const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: {
        main: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[id].[contenthash].js',  // 修改后的输出文件名
        assetModuleFilename: 'assets/[name].[hash][ext][query]',  // 修改后的资源文件名
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'esbuild-loader',
                    options: {
                        loader: 'jsx',
                        target: 'es2015',
                    },
                },
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                strictMath: true,
                                noIeCompat: true,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'imgs/[name].[hash][ext][query]',  // 修改后的图片文件名
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    },
                },
            },
            {
                test: /\.json$/i,
                type: 'asset/source',
                generator: {
                    filename: 'json/[name].[hash][ext][query]',  // 修改后的JSON文件名
                },
            },
            {
                test: /\.(ico|txt)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[name].[hash][ext][query]',  // 修改后的资源文件名
                },
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
        runtimeChunk: 'single',
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                    compress: {
                        warnings: false,
                    },
                },
                extractComments: false,
            }),
            new CssMinimizerPlugin(),
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        }),
        new ImageMinimizerPlugin({
            minimizer: {
                implementation: ImageMinimizerPlugin.imageminGenerate,
                options: {
                    plugins: [
                        ['gifsicle', { interlaced: true }],
                        ['jpegtran', { progressive: true }],
                        ['optipng', { optimizationLevel: 5 }],
                        [
                            'svgo',
                            {
                                plugins: [
                                    {
                                        removeViewBox: false,
                                    },
                                ],
                            },
                        ],
                    ],
                },
            },
        }),
    ],
    performance: {
        hints: 'warning',
        maxEntrypointSize: 512 * 1024,
        maxAssetSize: 256 * 1024,
    },
};
