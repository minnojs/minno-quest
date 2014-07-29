var file;
var allTestFiles = [];
var TEST_REGEXP = /_test\.js$/;

var pathToModule = function(path) {
	//return path.replace(/^\/base\//, '').replace(/\.js$/, '');
	return path.replace(/^\/base\/src\/js\/|\.js$/g,'');
};

// We can't use Object.keys because IE8
for(file in window.__karma__.files){
	if (TEST_REGEXP.test(file)) {
		// Normalize paths to RequireJS module names.
		allTestFiles.push(pathToModule(file));
	}
}

/* global requirejs */
requirejs.config({
	waitSeconds: 0,
	// Karma serves files from '/base'
	baseUrl: '/base/src/js',

	paths: {
		underscore: "../../bower_components/lodash/dist/lodash",
		angular: '../../bower_components/angular/angular',
		angularMocks: '../../bower_components/angular-mocks/angular-mocks',
		jquery: '../../bower_components/jquery/dist/jquery',
		text: '../../bower_components/requirejs-text/text'
	},

	shim: {
		'angular' : {'exports' : 'angular'},
		'angularMocks': {
			deps:['angular'],
			'exports':'angular.mock'
		}
	},
	// ask Require.js to load these files (all our tests)
	deps: ['../../bower_components/es5-shim/es5-shim','../../test/matchers','angular', 'angularMocks', 'jquery'], //allTestFiles,

	//urlArgs: 'bust=' + (new Date()).getTime(),

	// start test run, once Require.js is done
	callback: function(){
		require(allTestFiles,window.__karma__.start);
	}
});