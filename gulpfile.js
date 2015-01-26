var gulp = require('gulp');
var applyTemplate = require('gulp-apply-template');
var rename = require('gulp-rename');
var data = require('gulp-data');
var path = require('path');
var exec = require('child_process').exec;
//var debug = require('gulp-debug');

gulp.task('clean', function(cb){
	var del = require('del');
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
	var marked = require('gulp-marked');
	var highlight = require('highlight.js');
	var frontMatter = require('gulp-front-matter');

	return gulp.src('src/**/*.md')
		.pipe(frontMatter({remove:true, property:'data'})) 		// set front matter into data
		.pipe(data(function(file){								// set basename into data
			return {basename:path.basename(file.path,'.md')};
		}))
		.pipe(marked({											// highlight pre
			highlight: function(code){
				return highlight.highlightAuto(code).value;
			}
		}))
		.pipe(applyTemplate({engine:'swig', template: function(context,file){
			return path.join(path.dirname(file.path), 'templates','md.swig');
		}}))
		.pipe(rename({extname: '.html'}))
		.pipe(gulp.dest('.'));
});

gulp.task('build:js', function(){
	var es = require('event-stream');
	var clone = require('gulp-clone');
	var docco = require('docco');

	// add scripts to stream
	var scripts = gulp.src('src/**/*.js');

	// add activation pages
	var playPages = scripts
		.pipe(clone())
		.pipe(applyTemplate({engine:'swig', template: function(context, file){
			context.url = path.basename(file.path);
			return path.join(path.dirname(file.path), 'templates', 'play.swig');
		}}))
		.pipe(rename({suffix:'Play',extname: '.html'}));

	// add docco pages
	var doccoPages = scripts
		.pipe(clone())
		.pipe(data(function(file){
			// use config instead of the global languages object.
			// we set the comment matcher and filter manually in order to bypass the config function of docco which uses explicit files
			var config = {
				languages: {
					".js": {name: "javascript",symbol: "//",commentMatcher : new RegExp("^\\s*//\\s?"),commentFilter : /(^#![/]|^\s*#\{)/}
				}
			};

			// Docco
			var sections = docco.parse(file.path, file.contents.toString('utf8'), config);
			docco.format(file.path, sections, config); // Format (adds highlighting to the sections object)

			return {sections: sections, basename: path.basename(file.path,'.js')};
		}))
		.pipe(applyTemplate({engine:'swig', template: function(context,file){
			// context.frontMatter = file.frontMatter;
			// context.basename = path.basename(file.path,'.html');
			return path.join(path.dirname(file.path), 'templates','docco.swig');
		}}))
		.pipe(rename({suffix:'Docco',extname: '.html'}));


	return es.merge(scripts, playPages, doccoPages).pipe(gulp.dest('.'));
});

gulp.task('build:css', function(){
	var sass = require('gulp-sass');
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