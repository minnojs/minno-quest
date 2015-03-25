/*jshint unused: vars */
define(['./config'], function(){

	require.config({
		packages: [
			{name: 'pipAPI', location:'APIs', main:'pi/pipAPI'},
			{name: 'questAPI', location:'APIs', main:'pi/questAPI'},
			{name: 'managerAPI', location:'APIs', main:'pi/managerAPI'}
		]
	});

	require(['angular','app'], function(angular, app) {
		angular.element().ready(function() {
			angular.resumeBootstrap([app.name]);
		});
	});
});