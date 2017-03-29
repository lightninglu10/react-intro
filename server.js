/* eslint no-console: 0 */

const express = require('express');
const path = require('path');
const env = process.env.NODE_ENV || 'development';

const port = process.env.PORT || 3000;

const app = require('./server_base');

if (env !== 'production') {
    const webpack = require('webpack');
    const webpackMiddleware = require('webpack-dev-middleware');
    const hotMiddleware = require('webpack-hot-middleware');
    const config = require('./webpack.config.js');
    const compiler = webpack(config);

    app.use(hotMiddleware(compiler));

    const middleware = webpackMiddleware(compiler, {
        stats: {
            publicPath: config.output.publicPath,
            hot: true,
            inline: true,
            colors: true,
            stats: { colors: true },
            historyApiFallback: true,
        }});

    app.use(middleware);
    app.get('*', function response(req, res) {
        res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
        res.end();
    });

     // Reload server-side code without affecting Webpack
    const chokidar = require('chokidar');
    const watcher = chokidar.watch('./backend');
    watcher.on('ready', function() {
        watcher.on('all', function() {
            console.log("Reload /api server...");
            Object.keys(require.cache).forEach(function(id) {
                if (/\/backend\//.test(id)) delete require.cache[id];
            });
        });
    });

} else {
    app.use('/static', express.static(__dirname + '/dist'));
    app.get('*', function response(req, res) {
        res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
}
app.listen(port, '0.0.0.0', function onStart(err) {
    if (err) {
        console.log(err);
    }
    console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
