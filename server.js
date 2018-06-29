/*var webpack =require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var config = require('./webpack.config')

new WebpackDevServer (webpack(config),{
	publicPath:config.output.publicPath,
	hot: true,
	historyApiFallback: true,
	quiet:false,
	noInfo: false,
	stats:{
		assets: false,
		colors: true,
		version: false,
		hash: false,
		timings:false,
		chunks: false,
		chunkModules: false
	}
}).listen(3000,'localhost',function(err){
	if(err){
		console.log(err);
	}
	console.log('Listening at localhost:3000');
});	*/

// 下面改成用middleware的方式启动
const express = require('express');
const webpack = require('webpack');
const webpackHotMiddleware = require('webpack-hot-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackHotMiddleware(compiler, {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
	quiet:false,
	noInfo: false,
	stats:{
		assets: false,
		colors: true,
		version: false,
		hash: false,
		timings:false,
		chunks: false,
		chunkModules: false
	}
}));

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});