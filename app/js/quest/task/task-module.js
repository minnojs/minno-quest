define(function(require){
	require('utils/mixer');
	require('utils/logger/logger-module');
	require('utils/database/database-module');

	var angular = require('angular');
	var taskProvider = require('./taskProvider');
	var parseProvider = require('./parseProvider');
	var module = angular.module('task', ['logger', 'database']);
	module.service('Task', taskProvider);
	module.service('taskParse', parseProvider);
	module.value('mixer', function(){});

	return module;
});