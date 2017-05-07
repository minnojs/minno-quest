define(function(require){

    var angular = require('angular');
    var module = angular.module('pi.canvas',[]);

    module.service('managerCanvas', require('./managerCanvasService'));

    return module;
});