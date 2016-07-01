// Generated on 2014-03-23 using generator-angular-require 0.1.11
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

var sauceBrowsers =	require('./test/sauceBrowsers');

module.exports = function (grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Define the configuration for all the tasks
	grunt.initConfig({

		// get package information
		pkg: grunt.file.readJSON('package.json'),

		bump: {
			// https://github.com/vojtajina/grunt-bump
			options: {
				files:			['package.json'],
				commitMessage:	'chore: release v%VERSION%',
				updateConfigs:	['pkg'],
				commitFiles:	['package.json','CHANGELOG.md', 'dist/**/*', 'src/styles/main.css*'],
				push: false
			}
		},

		// Project settings
		settings: {
			// configurable paths
			app: require('./bower.json').appPath || 'src',
			dist: 'dist',
			banner: {
				compact: '/*! <%= pkg.name %> <%= pkg.version %> (Custom Build) | <%= pkg.license %> */',
				full: '/*!\n' +
					' * @license <%= pkg.name %> v<%= pkg.version %>\n' +
					' * Copyright 2013-2015 Project Implicit\n' +
					' *\n' +
					' * Licensed under the Apache License, Version 2.0 (the "License");\n' +
					' * you may not use this file except in compliance with the License.\n' +
					' * You may obtain a copy of the License at\n' +
					' *\n' +
					' * \thttp://www.apache.org/licenses/LICENSE-2.0\n' +
					' *\n' +
					' * Unless required by applicable law or agreed to in writing, software\n' +
					' * distributed under the License is distributed on an "AS IS" BASIS,\n' +
					' * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n' +
					' * See the License for the specific language governing permissions and\n' +
					' * limitations under the License.\n' +
					' */\n'
			}
		},

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			js: {
				files: ['<%= settings.app %>/js/**/*.js'],
				tasks: ['newer:jshint:all'],
				options: {
					livereload: true
				}
			},
			jsTest: {
				files: ['<%= settings.app %>/js/**/*_test.js'],
				tasks: ['karma', 'newer:jshint:test']
			},
			styles: {
				files: ['<%= settings.app %>/styles/{,*/}*.css'],
				tasks: ['newer:copy:styles', 'autoprefixer']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= settings.app %>/{,*/}*.html',
					'.tmp/styles/{,*/}*.css',
					'<%= settings.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: 'localhost',
				livereload: 35729
			},
			livereload: {
				options: {
					open: true,
					base: [
						'.tmp',
						'.'//'<%= settings.app %>'
					]
				}
			},
			test: {
				options: {
					port: 9001,
					base: [
						'.tmp',
						'test',
						'<%= settings.app %>'
					]
				}
			},
			dist: {
				options: {
					base: '<%= settings.dist %>'
				}
			}
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'Gruntfile.js',
				'<%= settings.app %>/js/{,*/}*.js',
				'!<%= settings.app %>/js/{,*/}*_test.js'
			],
			test: {
				src: '<%= settings.app %>/js/{,*/}*_test.js'
			}
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= settings.dist %>/*',
						'!<%= settings.dist %>/.git*'
					]
				}]
			},
			server: '.tmp'
		},

		// Replace Google CDN references
		cdnify: {
			dist: {
				html: ['<%= settings.dist %>/*.html']
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= settings.app %>',
					dest: '<%= settings.dist %>',
					src: [
						'*.{ico,png,txt}',
						'.htaccess',
						'*.html',
						'views/{,*/}*.html',
						'libs/**/*',
						'images/{,*/}*.{webp}',
						'fonts/*'
					]
				}, {
					expand: true,
					cwd: '.tmp/images',
					dest: '<%= settings.dist %>/images',
					src: ['generated/*']
				}]
			},
			styles: {
				expand: true,
				cwd: '<%= settings.app %>/styles',
				dest: '.tmp/styles/',
				src: '{,*/}*.css'
			}
		},

		// Run some tasks in parallel to speed up the build process
		concurrent: {
			server: [
				'copy:styles'
			],
			test: [
				'copy:styles'
			],
			dist: [
				'copy:styles'
			]
		},

		// Test settings
		karma: {
			options: {
				configFile: 'test/karma.conf.js'
			},
			// test on localhost:8080
			local: {
				singleRun: false,
				autoWatch: true,
				reporters: 'progress'
			},
			unit:{
				singleRun: true,
				reporters : grunt.option('report') ? ['spec'] : ['progress'],
				browsers: ['PhantomJS_Desktop']
			},
			sauce:{
				sauceLabs: {
					testName: 'PIQuest Unit Tests <%= pkg.version %>',
					recordScreenshots: false
				},
				captureTimeout: 120000, // rely on SL timeout

				// useful with really bad connections
				// https://groups.google.com/forum/#!topic/karma-users/B-E7nLphNHQ
				browserNoActivityTimeout: 120000,
				browserDisconnectTolerance: 3,
				customLaunchers: sauceBrowsers,
				browsers: Object.keys(sauceBrowsers),
				reporters: ['saucelabs'],
				singleRun: true
			}
		},

		githooks: {
			all: {
				'pre-commit': 'default'
			}
		},

		requirejs: {
			compile:{
				options : {
					// Creates a dist folder with optimized js
					dir: "dist",
					appDir: '<%= settings.app %>',
					baseUrl: 'js',
					removeCombined: true,
					generateSourceMaps: true,
					preserveLicenseComments: false,
					optimize: 'uglify2',
					// optimize:'none', // toggle this for fast optimized debuging
					skipDirOptimize: true,

					// Tells Require.js to look at main.js for all shim and path configurations
					mainConfigFile: ['<%= settings.app %>/js/config.js'],

					fileExclusionRegExp: /(\.scss|\.md|_test\.js)$|^example/,
					paths: {
						// Libs
						jquery: 'empty:'
					},

					packages:[
						{
							name: 'pipScorer',
							location: '../../bower_components/PIPlayer/src/js/extensions/dscore',
							main: 'Scorer'
						}
					],

					modules: [
						{
							name: 'bootstrap',
							include: ['app','pipScorer', 'pipAPI','questAPI','managerAPI'],
							override: {
								map: {
									'*': {
										pipAPI: 'APIs/pipAPI',
										questAPI: 'APIs/questAPI',
										managerAPI: 'APIs/managerAPI'
									}
								}
							}
						},
						{
							name: 'pibootstrap',
							include: ['app','pipScorer', 'pipAPI','questAPI','managerAPI'],
							override: {
								map: {
									'*': {
										pipAPI: 'APIs/PIpipAPI',
										questAPI: 'APIs/PIquestAPI',
										managerAPI: 'APIs/PImanagerAPI'
									}
								}
							}
						}
					]
				}
			}
		},

		sass: {
			options: {
				includePaths: ['bower_components/bootstrap-sass-official/assets/stylesheets/', 'bower_components/'],
				sourceMap: true,
				outputStyle: 'compressed'

			},
			dist: {
				files: {'src/styles/main.css':'src/styles/main.scss'}

			}
		}
	});


	grunt.registerTask('serve', function (target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:server',
			'concurrent:server',
			'connect:livereload',
			'watch:jsTest'
		]);
	});

	grunt.registerTask('version', 'Advancing version', function(type){
		grunt.task.run([
			"bump:" + (type || 'patch') + ":bump-only",
			'build',
			'changelog',
			'bump-commit'
		]);
	});

	grunt.registerTask('test', [
		'clean:server',
		'concurrent:test',
		'connect:test',
		'karma:unit'
	]);

	grunt.registerTask('test','Running tests', function(){
		var tasks = [
			'clean:server',
			'concurrent:test',
			'connect:test',
			'karma:unit'
		];

		if (grunt.option('sauce')){
			// make sure we have the access keys available
			if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
				console.warn('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
				process.exit(1);
			}

			tasks.push('karma:sauce');
		}

		grunt.task.run(tasks);
	});

	grunt.registerTask('build', [
		'sass',
		'requirejs'
	]);

	grunt.registerTask('default', [
		//'newer:jshint',
		'test'
	]);
};
