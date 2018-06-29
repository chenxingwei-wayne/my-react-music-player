var path=require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var ManifestPlugin = require('webpack-manifest-plugin');
module.exports = {
  mode: 'development', //用这种模式要用2.7秒
  //mode: 'production',// 用这种模式要用6.5秒，也就是生产的打包更麻烦，花的时间更长。
	entry:{
    /*'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',*/
		app: path.join(__dirname, 'app/index.js'),
    another: path.join(__dirname, 'app/another-module.js')
	},
  // 加了这个devtool可以帮我迅速找到代码出错的具体位置。
  devtool: 'inline-source-map',
  devServer: {
    // 通过下面两种方式指定contentBase反而出问题了。明天好好研究一下为什么。
    //contentBase: './dist'
    //contentBase: path.join(__dirname, 'static'),
    // 提供资源的路径有问题，如果用的是空就可以，或者直接不设置contentBase也是没有问题的。
    contentBase: path.join(__dirname, ''),
    // chunkhash与热更新不能同时使用，这里暂时注释掉。
   /* hot: true*/
  },
	output:{
	  path: path.join(__dirname, '/dist/'),
    // 这里的name就是entry里面的键
    filename: '[name].[chunkhash].js',
    publicPath: '/'
	},
   optimization: {
     splitChunks: {
       cacheGroups: {
         vendor: {
           test: /[\\/]node_modules[\\/]/,
           name: 'vendors',
           chunks: 'all'
         }
       }
     },
     runtimeChunk: 'single'
   },
	plugins: [
        new CleanWebpackPlugin(['dist']),
        new ManifestPlugin(),
        new HtmlWebpackPlugin({
          title: 'my app',
          // 用于指定生成index.html的模板
          template: './index.tpl.html',
          inject: true,
          filename: './index.html'
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        //// chunkhash与热更新不能同时使用，这里暂时注释掉。
        /*new webpack.HotModuleReplacementPlugin(),*/
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ],
    module: {
          
        rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: "babel-loader",
              // 下面这个query要么在这里使用，要么在其他地方使用.babelrc的文件。
              query:
                {
                  presets:['react','es2015','stage-0']
                }
            },
            
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.less/,
                loader: 'style-loader!css-loader!less-loader'
            },
            // 配置用于加载图片文件的file-loader。
            {
              test: /\.(png|svg|jpg|gif)$/,
              use: [
                'file-loader'
              ]
            }

        ]
    }
};