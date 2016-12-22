var gulp = require('gulp');
var applyTemplate = require('gulp-apply-template');
var rename = require('gulp-rename');
var data = require('gulp-data');
var path = require('path');
var exec = require('child_process').exec;
//var debug = require('gulp-debug');

var pagesPath = 'src/[0-9].[0-9]/{quest,questExamples,qsts,manager,basics,sequencer}/';

function addNames(file,obj){
	obj.dirname = path.dirname(file.path).match(/[^\/]*$/)[0]; // only the last segment of the dirname
	obj.typeName = obj.dirname;

	if (obj.dirname == 'questExamples' || obj.dirname == 'qsts'){ obj.typeName = 'quest'; }
    if (obj.dirname == 'sequencer') { obj.typeName = 'basics'; }

	return obj;
}

gulp.task('clean', function(cb){
	var del = require('del');
	del(['0.0/*'],cb);
});

// just copy html over
gulp.task('build:html', function(){
	return gulp.src(['src/[0-9].[0.9]/index.html', pagesPath + '*.html'])
		.pipe(gulp.dest('.'));
});

gulp.task('build:md', function () {
	var marked = require('gulp-markdown');
	var highlight = require('highlight.js');
	var frontMatter = require('gulp-front-matter');

	return gulp.src(pagesPath + '*.md')
		.pipe(frontMatter({remove:true, property:'data'})) 		// set front matter into data
		.pipe(data(function(file){								// set basename into data
			return addNames(file,{
				basename:path.basename(file.path,'.md') // file name
			});
		}))
		.pipe(marked({											// highlight pre
			highlight: function(code){
				return highlight.highlightAuto(code).value;
			},
            renderer: getRenderer()
		}))
		.pipe(applyTemplate({engine:'swig', template: function(context,file){
			return path.join(path.dirname(file.path), '../templates','md.swig');
		}}))
		.pipe(rename({extname: '.html'}))
		.pipe(gulp.dest('.'));

    // from https://github.com/chjj/marked
    function getRenderer(){
        var renderer = new marked.marked.Renderer();

        renderer.heading = function (text, level) {

            // from https://github.com/thlorenz/anchor-markdown-header/blob/master/anchor-markdown-header.js
            var escapedText =  text.replace(/ /g,'-')
                .toLowerCase()
                // escape codes
                .replace(/%([abcdef]|\d){2,2}/ig, '')
                // single chars that are removed
                .replace(/[\/?!:\[\]`.,()*"';{}+=<>~\$|#@]/g,'');
          
            return [
                '<h' + level + '>',
                    '<a name="' + escapedText + '" class="header-link" href="#' + escapedText + '">',
                        '<span class="glyphicon glyphicon-link"></span>',
                    '</a>',
                    text,
                '</h' + level + '>'
            ].join('');
        };

        return renderer;
    } 
});

gulp.task('build:swig', function(){
	return gulp.src(pagesPath + '*.swig')
		.pipe(data(function(file){								// set basename into data
			return addNames(file,{
				basename:path.basename(file.path,'.md') // file name

			});
		}))
		.pipe(applyTemplate({engine:'swig', template: function(context,file){
			return file.path;
		}}))
		.pipe(rename({extname: '.html'}))
		.pipe(gulp.dest('.'));
});

gulp.task('build:js', function(){
	var es = require('event-stream');
	var clone = require('gulp-clone');
	var docco = require('docco');

	// add scripts to stream
	var scripts = gulp.src(pagesPath + '*.js');

	// add activation pages
	var playPages = scripts
		.pipe(clone())
		.pipe(data(function(file){
			return addNames(file,{
				filecontents: file.contents.toString('utf8'),
				basename: path.basename(file.path,'.js')
			});
		}))
		.pipe(applyTemplate({engine:'swig', template: function(context, file){
			context.url = path.basename(file.path);
			return path.join(path.dirname(file.path), '../templates', 'play.swig');
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

			return addNames(file,{
				sections: sections,
				basename: path.basename(file.path,'.js')
			});
		}))
		.pipe(applyTemplate({engine:'swig', template: function(context,file){
			// context.frontMatter = file.frontMatter;
			// context.basename = path.basename(file.path,'.html');
			return path.join(path.dirname(file.path), '../templates','docco.swig');
		}}))
		.pipe(rename({suffix:'Docco',extname: '.html'}));


	return es.merge(scripts, playPages, doccoPages).pipe(gulp.dest('.'));
});

gulp.task('build:css', function(){
	var sass = require('gulp-sass');
	var es = require('event-stream');
	var sassStream = gulp.src('src/**/*.scss')
		.pipe(sass({errLogToConsole: true}));

	var cssStream = gulp.src('src/**/*.css');

	return es.merge(sassStream, cssStream).pipe(gulp.dest('.'));
});

gulp.task('build',  ['build:js', 'build:md', 'build:css', 'build:swig','build:html']);

gulp.task('deploy', function(cb){
	exec('scripts/deploy.sh', function(){
		gulp.run('build', cb);
	});
});

gulp.task('watch', function(){
	gulp.watch(['src/**/*'], ['build']);
});

gulp.task('default', ['build']);
