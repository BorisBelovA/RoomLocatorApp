var path = require('path');

module.exports = {
    entry: './www/js/app.js',
    output: {
        filename: "bundle.js",
        path:path.resolve(__dirname,'www/js')
    }
};