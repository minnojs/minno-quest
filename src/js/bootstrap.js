/*jshint unused: vars */
define([], function(){
	var req = require.config({
		paths: {
			questAPI: 'quest/API',
			underscore: ["//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min","../../bower_components/lodash/dist/lodash.min"],
			angular: ['../../bower_components/angular/angular'],
			animate: ['../../bower_components/angular-animate/angular-animate.min'],
			text: ['//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text.min','../../bower_components/requirejs-text/text']
		},
		shim: {
			angular : {exports : 'angular'},
			animate : {deps: ['angular'], exports: 'angular'}
		},
		deps: [
			'angular', 'animate', 'underscore','text'
		]
	});

	//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
	window.name = 'NG_DEFER_BOOTSTRAP!';

	require(['angular','app'], function(angular, app) {
		angular.element().ready(function() {
			angular.resumeBootstrap([app.name]);
		});
	});

	return req;
});