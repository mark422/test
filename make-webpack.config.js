var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

var resource = path.resolve(process.cwd(), 'src');

function makeConf(options){
	options = options || {};
	var debug = options.debug !== undefined ? options.debug : true;
	var entries = getEntries();
    var chunks = Object.keys(entries);

	var conf = {
		entry: entries,
		output:{
			path: path.resolve(debug ? '__build' : 'dest'),
			filename: debug ? '[name].js' : 'js/[chunkhash:8].[name].js',
            chunkFilename: debug ? '[name].js' : 'js/[chunkhash:8].chunk.min.js',
			publicPath: '/'
		},
	    resolve: {
	        root: [resource],
	        extensions: ['', '.js', '.css', '.scss', '.html', '.tpl', '.png', '.jpg']
	    },
		module:{
			loaders:[
				{
					test:/\.tpl$/i,
					loader:'ejs'
				}
			]
		},
		plugins:[
            new CommonsChunkPlugin({
                name: 'vendors',
                chunks: chunks,
                minChunks: chunks.length // 提取所有chunks共同依赖的模块
            })
		],

	    devServer: {
	        stats: {
	            cached: false,
	            exclude: /node_modules/,
	            colors: true
	        }
	    }
	};

	if(debug){
		conf.module.loaders.push({
			test:/\.css$/i,
			loader: 'style!css'
		})
	}else{
		conf.module.loaders.push({
			test:/\.css$/i,
            loader: ExtractTextPlugin.extract('style', 'css', {publicPath: '../'})
		})
        conf.plugins.push(new ExtractTextPlugin('css/[chunkhash:8].[name].css'));

		eachHtml({
			url:resource,
			suf:'.html',
			exclude:['css','js','img']
		},function(file){
			var htmlConf = {
				template:path.resolve(file.url, file.fileName),
				filename:'html/'+file.fileName,
				inject:'body'
			}
			var name = file.fileName.match(/(.+)\.html$/)[1];
			htmlConf.chunks = ['vendors', name];
			conf.plugins.push(new HtmlWebpackPlugin(htmlConf));
		})
	}

	return conf;
}

//动态生成入口文件列表
function getEntries() {
    var jsDir = path.resolve(process.cwd(), 'src', 'js');
    var names = fs.readdirSync(jsDir);
    var map = {};

    names.forEach(function(name) {
        var m = name.match(/(.+)\.js$/);
        var entry = m ? m[1] : '';
        var entryPath = entry ? path.resolve(jsDir, name) : '';

        if(entry) map[entry] = entryPath;
    });

    return map;
}

function eachHtml(opt,fn) {
	var url = opt.url,
		suf = opt.suf,
		exclude = opt.exclude,
		files = fs.readdirSync(url);

	files.forEach(function(file){
		var stat = fs.statSync(path.resolve(url,file)),
			dirName = (opt.dirName && url.indexOf(opt.dirName) !== -1) ? opt.dirName : '';

		if(stat.isDirectory() && exclude.indexOf(file) === -1){
			opt.url = path.resolve(url,file);
			opt.dirName = file;

			eachHtml(opt,fn);

			return;
		}

		if(file.indexOf(suf) !== -1) {
			fn({
				url:url,
				fileName:file,
				dirName:dirName
			})
		}
	})
}

module.exports = makeConf;