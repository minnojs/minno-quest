define(function(require){

	var angular = require('angular');
	var module = angular.module('task', [
		require('utils/logger/logger-module').name,
		require('utils/database/databaseModule').name,
		require('utils/console/consoleModule').name
	]);

	module.service('QuestSequence', require('./questSequenceProvider'));
	module.service('Task', require('./taskProvider'));
	module.service('taskParse', require('./parseProvider'));

	module.value('dfltQuestLogger', require('./dfltQuestLogger'));

	return module;
});