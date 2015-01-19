/*jshint unused: vars */
define(['./config'], function(){

	require.config({
		paths: {
			// APIs
			pipAPI: 'pi/pipAPI',
			questAPI: 'pi/questAPI',
			managerAPI: 'pi/managerAPI'
		}
	});

	require(['angular','app'], function(angular, app) {
		angular.element().ready(function() {
			angular.resumeBootstrap([app.name]);
		});
	});
});