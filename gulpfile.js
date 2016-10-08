var gulp = require('gulp');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var gutil = require('gulp-util');
var htmlmin = require('gulp-htmlmin');
var webpack = require('webpack');
var markConf = require('./make-webpack.config.js');
var webpackConf = markConf({debug:false});

var path = require('path');

gulp.task('clean',function(){
	gulp.src('dest')
		.pipe(clean());
})

gulp.task('pack',['clean'],function(done){
	webpack(webpackConf,function(){
		done()
	});
})

gulp.task('default',['pack'],function(){
	return gulp.src('dest/**/*.html')
        .pipe(replace(/<script([^>]+)?(data-debug)([^>]+)?><\/script>/g, ''))
        .pipe(replace(/(<!--debug-->.+<!--\/debug-->)[^<>]*(<script[^>]*>.*<\/script>)/img, '$2$1'))
        .pipe(gulp.dest('dest'));
})
