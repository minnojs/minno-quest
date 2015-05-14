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

		// integrate with erroception
		app.config(['$provide',function($provide) {
			$provide.decorator("$exceptionHandler", ['$delegate','$window', function($delegate, $window) {
				return function(exception, cause) {
					$window._errs && $window._errs.push(exception);
					$delegate(exception, cause);
				};
			}]);
		}]);

		// resume boot strap
		angular.element().ready(function() {
			angular.resumeBootstrap([app.name]);
		});
	});
});