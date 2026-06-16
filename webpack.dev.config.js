const { createConfig } = require('@openedx/frontend-build');
const stripWutiskillParagonTheme = require('../webpack.wutiskill-theme');

const config = createConfig('webpack-dev');

stripWutiskillParagonTheme(config);

module.exports = config;
