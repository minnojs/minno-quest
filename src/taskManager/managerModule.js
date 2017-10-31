import angular from 'angular';
import taskModule from './task/taskModule';
import canvasModule from './canvas/canvasModule';
import utilsModule from 'utils/utils/utilsModule';
import helperDirectivesModule from 'utils/helperDirectives/helperDirectivesModule';
import consoleModule from 'utils/console/consoleModule';
import managerService from './managerService';
import managerSequence from './managerSequence';
import managerLoadService from './managerLoadService';
import managerGetScriptService from './managerGetScriptService';
import managerTaskLoadService from './managerTaskLoadService';
import beforeUnloadFactory from './beforeUnloadFactory';
import injectStyle from './injectStyle';
import managerDirective from './managerDirective';
import managerTaskDirective from './managerTaskDirective';
import piLinkDirective from './piLinkDirective';

export default module;

var module = angular.module('taskManager',[
    taskModule.name,
    canvasModule.name,
    utilsModule.name,
    helperDirectivesModule.name,
    consoleModule.name
]);

module.service('managerService', managerService);
module.service('managerSequence', managerSequence);
module.service('managerLoad', managerLoadService);
module.service('managerGetScript', managerGetScriptService);
module.service('managerTaskLoad', managerTaskLoadService);
module.factory('managerBeforeUnload', beforeUnloadFactory);
module.constant('managerInjectStyle', injectStyle);
module.directive('piManager', managerDirective);
module.directive('piManagerTask', managerTaskDirective);

module.directive('piLink', piLinkDirective);
