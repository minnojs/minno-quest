/**
 * The module responsible for the single task.
 * It knows how to load a task and activate it.
 * It also supplies the basic task directive.
 * @return {module} pi.task module.
 */

import angular from 'angular';
import taskActivateProvider from './taskActivateProvider';
import taskDirective from './taskDirective';

import activateQuest from './tasks/questTask';
import activateMessage from './tasks/messageTask';
import activatePostCsv from './tasks/postCsvTask';
import activatePost from './tasks/postTask';
import activateRedirect from './tasks/redirectTask';
import activatePIP from './tasks/pipTask';
import activateTime from './tasks/timeTask';
import activateAllowLeaving from './tasks/allowLeaving';
import activateChoose from './tasks/choose';

export default module;

var module = angular.module('pi.task',[]);
module.provider('taskActivate', taskActivateProvider);
module.directive('piTask', taskDirective);

module.config(['taskActivateProvider', function(activateProvider){
    activateProvider.set('postCsv', activatePostCsv);
    activateProvider.set('quest', activateQuest);
    activateProvider.set('message', activateMessage);
    activateProvider.set('post', activatePost);
    activateProvider.set('redirect', activateRedirect);
    activateProvider.set('pip', activatePIP);
    activateProvider.set('time', activateTime);
    activateProvider.set('allowLeaving', activateAllowLeaving);
    activateProvider.set('choose', activateChoose);
}]);
