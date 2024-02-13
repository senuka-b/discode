const path = require('path');
const { override, addWebpackResolve } = require('customize-cra');

module.exports = override(
  addWebpackResolve({
    fallback: {

      "path": require.resolve("path-browserify")
    }
  })
);
