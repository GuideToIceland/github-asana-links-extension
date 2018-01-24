
const path = require('path');

module.exports = {
  entry: {
  	index: './src/index.js',
  	popup: './src/popup.js',
  	background: './src/background.js'
  },
  output: {
    path: path.resolve(__dirname, 'extension/bundle/'),
    filename: '[name].js'
  }
};
