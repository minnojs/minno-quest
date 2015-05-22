/**
 *	The main module that ties the whole application together.
 *	Essentially, we are creating a module with dependencies on anything interesting...
 */
define(function (require) {

	var angular = require('angular');
	var _ = require('underscore');

	var submodules = [
		require('quest/questModule').name,
		require('message/messageModule').name,
		require('taskManager/managerModule').name,
		require('utils/animations/animationModule').name,
		require('utils/console/consoleModule').name
	];

	var app = angular.module('piApp', submodules);

	// setup the global variable
	app.run(['$rootScope', '$rootElement', '$parse', '$window', function($rootScope, $rootElement, $parse, $window){
		// @TODO: get these out of here (app.config? app.run?)
		var globalAttr = $rootElement.attr('pi-global');
		var piGlobal = $parse(globalAttr)($window);

		// create the global object
		window.piGlobal || (window.piGlobal = {});
		$rootScope.global = window.piGlobal;

		if (piGlobal){
			_.extend($rootScope.global, piGlobal);
		}
	}]);

	return app;
});