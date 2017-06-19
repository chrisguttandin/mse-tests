const { resolve } = require('path');

module.exports = {
    deault: {
        entry: {
            app: './src/scripts/app.js'
        },
        module: {
            rules: [ {
                exclude: /node_modules/,
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ [ 'env', {
                            targets: {
                                browsers: [ 'last 2 versions' ]
                            }
                        } ] ]
                    }
                }
            } ]
        },
        output: {
            filename: '[name].js',
            path: resolve('build/scripts')
        }
    }
};