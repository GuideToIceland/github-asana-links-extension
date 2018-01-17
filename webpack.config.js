
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'extension/bundle/'),
    filename: 'index.js'
  }
};