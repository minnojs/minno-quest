
import angular from 'angular';
import Logger from './LoggerProvider';

var module = angular.module('logger', [consoleModule.name]);
import consoleModule from 'utils/console/consoleModule';
module.provider('Logger', Logger);

export default module;
