define(function(require){
	var angular = require('angular');

	// load modules
	var provider = require('./sequenceProvider');


	// set modules requirements
	var subModules = [];

	var module = angular.module('sequence',subModules);
	module.provider('$sequence', provider);

	// Shortcut to current task. Makes testing a lot easier...
	module.factory('currentTask', ['$sequence', function($sequence){
		return $sequence.current;
	}]);

	return module;
});
