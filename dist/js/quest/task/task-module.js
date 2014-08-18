define(function(require){
	require('utils/logger/logger-module');
	require('utils/database/database-module');
	require('utils/mixer/mixer-module');
	require('utils/template/templateModule');

	var angular = require('angular');
	var module = angular.module('task', ['logger', 'database','mixer', 'template']);

	module.service('QuestSequence', require('./questSequenceProvider'));
	module.service('TaskSequence', require('./taskSequenceProvider'));
	module.service('Task', require('./taskProvider'));
	module.service('taskParse', require('./parseProvider'));

	module.value('dfltQuestLogger', require('./dfltQuestLogger'));

	return module;
});