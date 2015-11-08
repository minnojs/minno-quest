/*jshint unused: vars */
define(['./config'], function(){

	require.config({
		map: {
			'*': {
				pipAPI: 'APIs/PIpipAPI',
				questAPI: 'APIs/PIquestAPI',
				managerAPI: 'APIs/PImanagerAPI'
			}
		}
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
		// http://stackoverflow.com/a/25770449/1400366
		// The angular.js detects dom ready via JQLite. When the document loads, it triggers a method which defines the resumeBootstrap method.
		// The problem is that you cannot enforce processing order between domready and JQLite ready,
		// if domready already fulfills your dependency before the method gets defined, you are in trouble.
		// The workaround is to enforce javascript to execute all event handlers before your resumeBootstrap invocation.
		// I've used the setTimeout method to do so, e.g.: setTimeout(angular.resumeBootstrap, 0).
		angular.element().ready(function() {
			setTimeout(function(){
				angular.resumeBootstrap([app.name]);
			},0);
		});
	});
});