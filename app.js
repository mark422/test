var http = require('http');
var path = require('path');
var fs = require('fs');

var koa = require('koa');
var serve = require('koa-static');

var webpackDevMiddleware = require('koa-webpack-dev-middleware');
var webpack = require('webpack');
var markConf = require('./make-webpack.config.js');
var webpackConf = markConf({debug:true});
var compiler = webpack(webpackConf);

// app.js
var http = require('http');
var koa = require('koa');
var serve = require('koa-static');

var app = koa();
var debug = process.env.NODE_ENV !== 'production';
// 开发环境和生产环境对应不同的目录

var viewDir = debug ? 'src' : 'dest';

var compiler = webpack(webpackConf);
// global events listen
app.on('error', function(err, ctx) {
    err.url = err.url || ctx.request.url;
    console.error(err, ctx);
});

app.use(webpackDevMiddleware(compiler, {
    contentBase: webpackConf.output.path,
    publicPath: webpackConf.output.publicPath,
    // hot: true,
    stats: webpackConf.devServer.stats
}));

// 处理静态资源和入口文件
app.use(serve(path.resolve(__dirname, viewDir), {
    maxage: 0
}));

app = http.createServer(app.callback());

app.listen(3005, '0.0.0.0', function() {
    console.log('app listen success.');
});