/*jshint unused: vars */
define([], function(){
	var req = require.config({
		paths: {
			questAPI: 'quest/API',
			underscore: ["//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min","../libs/lodash/dist/lodash.min"],
			angular: ["//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.0-beta.7/angular.min", '../libs/angular/angular.min'],
			text: ['//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text.min','../libs/requirejs-text/text']
		},
		shim: {
			angular : {exports : 'angular'},
			angularUi : {
				deps: ['angular'],
				exports: 'angular.ui'
			}
		},
		deps: [
			'angular', 'underscore','text'
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