// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
	config.set({
		// base path, that will be used to resolve files and exclude
		basePath: '..',

		// testing framework to use (jasmine/mocha/qunit/...)
		frameworks: ['jasmine', "requirejs"],

		// list of files / patterns to load in the browser
		files: [
			{pattern: 'test/matchers.js', included: false },
			{pattern: 'bower_components/**/*.js', included: false },
			{pattern: 'src/js/**/*.js', included: false },
			{pattern: 'src/js/**/*.html', watched: true, included: false, served: true},

			// http://karma-runner.github.io/0.12/plus/requirejs.html
			'test/test-bootstrap.js'
		],

		// list of files / patterns to exclude
		exclude: [
			'src/js/bootstrap.js'
		],

		// use dolts reporter, as travis terminal does not support escaping sequences
		// possible values: 'dots', 'progress', 'junit', 'teamcity'
		// CLI --reporters progress
		// reporters : ['spec'],


		// web server port
		port: 8080,

		// level of logging
		// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
		logLevel: config.LOG_INFO,

		customLaunchers: {
			'PhantomJS_Desktop': {
				base: 'PhantomJS',
				options: {
					viewportSize: {
						width: 1228,
						height: 1000
					}
				}
			}
		},


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		// browsers: ['PhantomJS'],
		browsers: ['PhantomJS_Desktop'],

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: true
	});
};
