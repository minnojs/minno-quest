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


gulp.task('clean', function(cb){
	del(['build'],cb);
});


// get README from master branch and copy it into 0.0/API.md
gulp.task('build:getapi' ,function(cb){
	exec('mkdir -p src/0.0 && git show master:README.md > src/0.0/API.md', cb);
});

gulp.task('build:md', ['build:getapi'] ,function () {
	return gulp.src('src/**/*.md')
		//.pipe(frontMatter({property: 'page', remove: true}))
		.pipe(marked({
			highlight: function(code){
				return highlight.highlightAuto(code).value;
			}
		}))
		.pipe(applyTemplate({engine:'jade', template: function(context,file){
			return path.join(path.dirname(file.path), 'md.jade');
		}}))
		.pipe(rename({extname: '.html'}))
		.pipe(gulp.dest('.'));
});

gulp.task('build:js', ['clean'], function(){
	var cloneSink = clone.sink();

	return gulp.src('src/**/*.js')
		// create activation pages using clone
		.pipe(cloneSink)
		.pipe(applyTemplate({engine:'jade', template: function(context, file){
			context.url = path.relative('.', file.path);
			return path.join(path.dirname(file.path), 'js.jade');
		}}))
		.pipe(rename({extname: '.html'}))
		.pipe(cloneSink.tap())
		.pipe(gulp.dest('build'));
});

gulp.task('build',  ['build:js', 'build:md']);

gulp.task('watch', function(){
	gulp.watch(['0.0/**/*'], ['build']);
});

gulp.task('build:bower', function(cb){
	exec('bower update', cb);
});

gulp.task('deploy', function(){
	gulp.run(['build'])
	// update bower
	// copy latest api.md(s) into the correct folder (using git.exec('git show master:quest/API.md'))
	// build
	// git add
	// git push
});

gulp.task('default', ['build']);