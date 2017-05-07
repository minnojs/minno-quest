define(function(require){
    var angular = require('angular');
    var module = angular.module('timer',[]);

    module.service('timerStopper', require('./timerStopper'));
    module.directive('piTimer', require('./timerDirective'));
    module.value('timerNow', require('./timerNow'));

    return module;
});