define(function(require){

    var angular = require('angular');
    var module = angular.module('taskManager',[
        require('./task/taskModule').name,
        require('./canvas/canvasModule').name,
        require('utils/utils/utilsModule').name,
        require('utils/helperDirectives/helperDirectivesModule').name,
        require('utils/console/consoleModule').name
    ]);

    module.service('managerService', require('./managerService'));
    module.service('managerSequence', require('./managerSequence'));
    module.service('managerLoad', require('./managerLoadService'));
    module.service('managerGetScript', require('./managerGetScriptService'));
    module.service('managerTaskLoad', require('./managerTaskLoadService'));
    module.factory('managerBeforeUnload', require('./beforeUnloadFactory'));
    module.constant('managerInjectStyle', require('./injectStyle'));
    module.directive('piManager', require('./managerDirective'));
    module.directive('piManagerTask', require('./managerTaskDirective'));

    module.directive('piLink', require('./piLinkDirective'));

    return module;
});


