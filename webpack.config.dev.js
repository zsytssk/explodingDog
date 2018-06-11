'use strict';
const path = require('path');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: ['./src/main.ts', './src/test.ts'],
    output: {
        filename: 'app.js',
        path: path.join(__dirname, 'laya/src'),
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(.*)?$/,
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.webpack.json',
                    transpileOnly: true,
                },
            },
        ],
    },
    watch: true,
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
};
