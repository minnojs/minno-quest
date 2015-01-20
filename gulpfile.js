var gulp = require('gulp');
var util = require('gulp-util');
var marked = require('gulp-marked');
var applyTemplate = require('gulp-apply-template');
var clone = require('gulp-clone');
var rename = require('gulp-rename');
var highlight = require('highlight.js');
var del = require('del');
var path = require('path');
var git = require('gulp-git');
var exec = require('child_process').exec;
var sass = require('gulp-sass');
var frontMatter = require('gulp-front-matter');


gulp.task('clean', function(cb){
	del(['0.0/*'],cb);
});

// get README from master branch and copy it into 0.0/API.md
gulp.task('build:getapi' ,function(cb){
	// add front matter to the API
	var APIfrontMatter = [
		'---',
		'title: API',
		'description: All the little details...',
		'---',
		'\n'
	].join("\n");

	exec('mkdir -p src/0.0 && echo "' +APIfrontMatter+ ' $(git show master:src/js/quest/API.md)" > src/0.0/API.md', cb);
});

gulp.task('build:md', ['build:getapi'] ,function () {
	return gulp.src('src/**/*.md')
		.pipe(frontMatter({remove:true}))
		.pipe(marked({
			highlight: function(code){
				return highlight.highlightAuto(code).value;
			}
		}))
		.pipe(applyTemplate({engine:'swig', template: function(context,file){
			context.frontMatter = file.frontMatter;
			context.basename = path.basename(file.path,'.html');
			return path.join(path.dirname(file.path), 'md.swig');
		}}))
		.pipe(rename({extname: '.html'}))
		.pipe(gulp.dest('.'));
});

gulp.task('build:js', function(){
	var cloneSink = clone.sink();

	return gulp.src('src/**/*.js')
		// create activation pages using clone
		.pipe(cloneSink)
		.pipe(applyTemplate({engine:'swig', template: function(context, file){
			context.url = path.join('scripts/', path.basename(file.path));
			return path.join(path.dirname(file.path), 'js.swig');
		}}))
		.pipe(rename({extname: '.html'}))
		.pipe(cloneSink.tap())
		.pipe(gulp.dest('.'));
});

gulp.task('build:css', function(){
	return gulp.src('src/**/*.scss')
		.pipe(sass({errLogToConsole: true}))
		.pipe(gulp.dest('.'));
});

gulp.task('build',  ['build:js', 'build:md', 'build:css']);


gulp.task('deploy:update', function(cb){
	exec('./scripts/getSource.sh', cb);
});

gulp.task('deploy', function(cb){
	gulp.start('deploy:update', function(err){
		if (err) {throw err;}
		gulp.start('clean', function(err){
			if (err) {throw err;}
			gulp.start('build',function(err){
				if (err) {throw err;}
				exec('git add . && git commit -am "chore(deploy): auto commit"', cb);
			});
		});
	});
});

gulp.task('watch', function(){
	gulp.watch(['src/**/*'], ['build']);
});


gulp.task('default', ['build']);