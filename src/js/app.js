/**
 *	The main module that ties the whole application together.
 *	Essentially, we are creating a module with dependencies on anything interesting...
 */
define(function (require) {

	var angular = require('angular');

	var submodules = [
		require('quest/questModule').name,
		require('taskManager/managerModule').name,
		require('utils/animations/animationModule').name,
		require('utils/console/consoleModule').name
	];

	return angular.module('piApp', submodules);
});