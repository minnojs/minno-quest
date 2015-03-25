/*jshint unused: vars */
define(['./config'], function(){

	require.config({
		packages: [
			{name: 'pipAPI', location:'APIs', main:'pipAPI'},
			{name: 'questAPI', location:'APIs', main:'questAPI'},
			{name: 'managerAPI', location:'APIs', main:'managerAPI'}
		]
	});

	require(['angular','app'], function(angular, app) {
		angular.element().ready(function() {
			angular.resumeBootstrap([app.name]);
		});
	});
});