define(function(require){
	require('utils/mixer');
	require('utils/logger/logger-module');
	require('utils/database/database-module');

	var angular = require('angular');
	var taskProvider = require('./taskProvider');
	var parseProvider = require('./parseProvider');
	var sequenceProvider = require('./taskSequenceProvider');
	var module = angular.module('task', ['logger', 'database']);

	module.service('TaskSequence', sequenceProvider);
	module.service('Task', taskProvider);

	module.service('taskParse', parseProvider);
	module.value('mixer', function(a){return a});

	return module;
});