"use strict";
const path = require('path');
module.exports = {
    entry: './Wallet.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '',
        filename: 'bundle.js'
    },
    mode: 'production'
};
