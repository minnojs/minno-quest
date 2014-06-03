define(function(require){
	require('utils/logger/logger-module');
	require('utils/database/database-module');

	var angular = require('angular');
	var module = angular.module('task', ['logger', 'database']);

	module.service('TaskSequence', require('./taskSequenceProvider'));
	module.service('Task', require('./taskProvider'));
	module.service('taskParse', require('./parseProvider'));

	module.value('dfltQuestLogger', require('./dfltQuestLogger'));
	module.value('mixer', function(a){return a;} || require('utils/mixer'));

	return module;
});