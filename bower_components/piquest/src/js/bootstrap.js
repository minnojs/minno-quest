/*jshint unused: vars */
define(['./config'], function(){
	require.config({
		paths: {
			// APIs
			pipAPI: 'pip/API',
			questAPI: 'quest/API',
			managerAPI: 'taskManager/API'
		}
	});

	require(['angular','app'], function(angular, app) {
		angular.element().ready(function() {
			angular.resumeBootstrap([app.name]);
		});
	});
});