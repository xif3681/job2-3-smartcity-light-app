var path = require('path');
var useDefaultConfig = require('@ionic/app-scripts/config/optimization.config.js');

module.exports = function () {
    useDefaultConfig.resolve.alias = {
        "@environment": path.resolve(__dirname + '/../../src/config/config.' + process.env.IONIC_ENV + '.ts'),
    };
    return useDefaultConfig;
};