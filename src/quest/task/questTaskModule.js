import angular from 'angular';
import loggerModule from 'utils/logger/logger-module';
import databaseModule from 'minno-sequencer/src/databaseModule';
import consoleModule from 'utils/console/consoleModule';
import questSequenceProvider from './questSequenceProvider';
import questTaskProvider from './questTaskProvider';
import parseProvider from './parseProvider';
import dfltQuestLogger from './dfltQuestLogger';

var module = angular.module('task', [
    loggerModule.name,
    databaseModule.name,
    consoleModule.name
]);

module.service('QuestSequence', questSequenceProvider);
module.service('QuestTask', questTaskProvider);
module.service('taskParse', parseProvider);

module.value('dfltQuestLogger', dfltQuestLogger);

export default module;
