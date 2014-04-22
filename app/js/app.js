/*
 *	The main module that ties the whole application together.
 *	Essentially, we are creating a module with dependencies on anything interesting...
 */
define(function (require) {

	var angular = require('angular');

	var submodules = [
		require('sequence/sequence-module').name,
		require('quest/quest').name
	];

	return angular.module('piApp', submodules);
});