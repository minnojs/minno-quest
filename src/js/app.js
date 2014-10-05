/**
 *	The main module that ties the whole application together.
 *	Essentially, we are creating a module with dependencies on anything interesting...
 */
define(function (require) {

	var angular = require('angular');
	require('animate'); // load animate as a dependency

	var submodules = [
		require('quest/questModule').name,
		require('taskManager/managerModule').name,
		'ngAnimate'
	];

	return angular.module('piApp', submodules);
});