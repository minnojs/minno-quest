import angular from 'angular';
import databaseModule from 'minno-sequencer/src/databaseModule';
import consoleModule from 'utils/console/consoleModule';
import questSequenceProvider from './questSequenceProvider';
import questTaskProvider from './questTaskProvider';
import parseProvider from './parseProvider';
import dfltQuestLogger from './logger/dfltQuestLogger';
import createLogStream from './logger/createLogStream';

var module = angular.module('task', [
    databaseModule.name,
    consoleModule.name
]);

module.service('QuestSequence', questSequenceProvider);
module.service('QuestTask', questTaskProvider);
module.service('taskParse', parseProvider);
module.value('Logger', createLogStream);

module.value('dfltQuestLogger', dfltQuestLogger);

export default module;
