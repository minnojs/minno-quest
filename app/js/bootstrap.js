/*jshint unused: vars */
define([], function(){
	var req = require.config({
		paths: {
			angular: '../libs/angular/angular',
			angularMocks: '../libs/angular-mocks/angular-mocks',
			text: '../libs/requirejs-text/text'
		},
		shim: {
			'angular' : {'exports' : 'angular'}
		},
		priority: [
			'angular'
		]
	});

	//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
	window.name = 'NG_DEFER_BOOTSTRAP!';

	require(['angular','app','quest/quest'], function(angular, app, mod) {

		/* jshint ignore:start */
		var $html = angular.element(document.getElementsByTagName('html')[0]);
		/* jshint ignore:end */
		angular.element().ready(function() {
			angular.resumeBootstrap([mod.name]);
		});
	});

	return req;
});