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
