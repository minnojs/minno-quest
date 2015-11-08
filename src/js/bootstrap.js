/*jshint unused: vars */
define(['./config'], function(){

	require.config({
		map: {
			'*': {
				pipAPI: 'APIs/pipAPI',
				questAPI: 'APIs/questAPI',
				managerAPI: 'APIs/managerAPI'
			}
		}
	});

	// resume boot strap
	// http://stackoverflow.com/a/25770449/1400366
	// The angular.js detects dom ready via JQLite. When the document loads, it triggers a method which defines the resumeBootstrap method.
	// The problem is that you cannot enforce processing order between domready and JQLite ready,
	// if domready already fulfills your dependency before the method gets defined, you are in trouble.
	// The workaround is to enforce javascript to execute all event handlers before your resumeBootstrap invocation.
	// I've used the setTimeout method to do so, e.g.: setTimeout(angular.resumeBootstrap, 0).
	require(['angular','app'], function(angular, app) {
		angular.element().ready(function() {
			setTimeout(function(){
				angular.resumeBootstrap([app.name]);
			},0);
		});
	});
});