define(function(require){
    var angular = require('angular');
    var module = angular.module('pi.message',[
        require('utils/console/consoleModule').name
    ]);

    module.directive('piMessage', require('./messageDirective'));
    module.directive('piMessageDone', require('./messageDoneDirective'));

    return module;
});