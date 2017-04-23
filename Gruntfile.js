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

	// Define the configuration for all the tasks
	grunt.initConfig({

		// get package information
		pkg: grunt.file.readJSON('package.json'),

		// Project settings
		settings: {
			// configurable paths
			app: 'src',
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
		}
	});


	grunt.registerTask('serve', function (target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:server',
            'copy:styles',
			'connect:livereload',
			'watch:jsTest'
		]);
	});

	grunt.registerTask('test', [
		'clean:server',
        'copy:styles',
		'connect:test',
		'karma:unit'
	]);

	grunt.registerTask('test','Running tests', function(){
		var tasks = [
			'clean:server',
            'copy:styles',
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

	grunt.registerTask('default', [
		'test'
	]);
};
