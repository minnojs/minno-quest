import angular from 'angular';
import Database from 'minno-sequencer';
import consoleModule from 'utils/console/consoleModule';
import questSequenceProvider from './questSequenceProvider';
import questTaskProvider from './questTaskProvider';
import parseProvider from './parseProvider';
import dfltQuestLogger from './logger/dfltQuestLogger';

var module = angular.module('task', [
    consoleModule.name
]);

module.service('QuestSequence', questSequenceProvider);
module.service('QuestTask', questTaskProvider);
module.service('taskParse', parseProvider);
module.factory('Database', function(){return Database;});
module.constant('mixerDefaultContext', Database.mixerDefaultContext);
module.constant('templateDefaultContext',Database.templateDefaultContext);

module.value('dfltQuestLogger', dfltQuestLogger);

export default module;
