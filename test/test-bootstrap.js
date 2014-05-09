var allTestFiles = ['../../test/matchers','angular', 'angularMocks', 'jquery'];
var TEST_REGEXP = /_test\.js$/;

var pathToModule = function(path) {
	//return path.replace(/^\/base\//, '').replace(/\.js$/, '');
	return path.replace(/^\/base\/app\/js\/|\.js$/g,'');
};


Object.keys(window.__karma__.files).forEach(function(file) {
	if (TEST_REGEXP.test(file)) {
		// Normalize paths to RequireJS module names.
		allTestFiles.push(pathToModule(file));
	}
});

/* global requirejs */
requirejs.config({
	// Karma serves files from '/base'
	baseUrl: '/base/app/js',

	paths: {
		underscore: "../libs/lodash/dist/lodash",
		angular: '../libs/angular/angular',
		angularMocks: '../libs/angular-mocks/angular-mocks',
		jquery: '../libs/jquery/dist/jquery',
		text: '../libs/requirejs-text/text'
	},

	shim: {
		'angular' : {'exports' : 'angular'},
		'angularMocks': {
			deps:['angular'],
			'exports':'angular.mock'
		}
	},
	// ask Require.js to load these files (all our tests)
	deps: ['../../test/matchers','angular', 'angularMocks', 'jquery'], //allTestFiles,

	//urlArgs: 'bust=' + (new Date()).getTime(),

	// start test run, once Require.js is done
	callback: function(){
		require(allTestFiles,window.__karma__.start);
	}
});