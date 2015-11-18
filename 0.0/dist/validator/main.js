/*jshint unused: vars */
define(function(){

	//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
	window.name = 'NG_DEFER_BOOTSTRAP!';

	require.config({
		// in order to catch IE errors
		enforceDefine: true,
		paths: {
			// libs
			underscore: "../../bower_components/lodash-compat/lodash.min",
			angular: '../../bower_components/angular/angular',
			text: '../../bower_components/requirejs-text/text'
		},
		packages: [
			{name: 'pipAPI', location:'../js/APIs', main:'PIpipAPI'},
			{name: 'questAPI', location:'../js/APIs', main:'PIquestAPI'},
			{name: 'managerAPI', location:'../js/APIs', main:'PImanagerAPI'}
		],

		shim: {
			angular : {exports : 'angular'}
		},
		deps: [
			// The APIs are preloaded into the app so we don't have to set them as dependencies here
			'angular', 'underscore','text'
		]
	});

	require(['angular','app','validator'], function(angular, app, validator) {
		angular.element().ready(function() {
			setTimeout(function(){angular.resumeBootstrap([app.name]);},0);
		});
	});

});