const { createConfig } = require('@openedx/frontend-build');
const stripWutiskillParagonTheme = require('./webpack.wutiskill-theme');

const config = createConfig('webpack-prod');

stripWutiskillParagonTheme(config);

module.exports = config;
