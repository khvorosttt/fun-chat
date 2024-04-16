const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, './src/index.ts'),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(mp3|ogg)$/,
                loader: 'file-loader',
            },
            {
                test: /\.ts$/i,
                use: 'ts-loader',
            },
            {
                test: /\.json$/,
                use: ['json-loader'],
                type: 'javascript/auto',
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index_bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    devServer: {
        open: true,
        host: 'localhost',
        port: 4000,
        historyApiFallback: true,
    },
    plugins: [new CleanWebpackPlugin(), new HtmlWebpackPlugin()],
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
};
