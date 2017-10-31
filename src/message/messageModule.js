import angular from 'angular';
import messageDirective from './messageDirective';
import messageDoneDirective from './messageDoneDirective';
import consoleModule from 'utils/console/consoleModule';

var module = angular.module('pi.message',[
    consoleModule.name
]);

module.directive('piMessage', messageDirective);
module.directive('piMessageDone', messageDoneDirective);

export default module;
