/* eslint ene:"node" */
// Karma configuration

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        // Make sure to disable Karma’s file watcher
        // because the preprocessor will use its own.
        files: [ 
            { pattern: 'test/matchers.js'},
            { pattern: 'node_modules/jquery/dist/jquery.js'},
            { pattern: 'node_modules/angular/angular.js'},
            { pattern: 'node_modules/angular-mocks/angular-mocks.js'},
			{ pattern: 'src/**/*_test.js', watched: false }
        ],

        // list of files to exclude
        exclude: [ ], 

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'src/**/*_test.js': ['rollup']
		},

		rollupPreprocessor: {
			plugins: [
                require('rollup-plugin-legacy')({
                    './node_modules/angular/angular.js':'angular',
                    './node_modules/angular-animate/angular-animate.js':'contains' // just force an export
                }),
                require('rollup-plugin-string')({include:['**/*.html', '**/*.jst']}),
				require('rollup-plugin-node-resolve')(),
				require('rollup-plugin-commonjs')()
            ],
            format: 'iife',         // Helps prevent naming collisions.
            name: 'minno',          // Required for 'iife' format.
            sourcemap: 'inline',    // Sensible for testing.
            external: ['angular'],
            globals: {
                lodash: '_',
                angular: 'angular',
                'angular-mocks': 'angular-mocks'
            }
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
};
