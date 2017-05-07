define(function(require){

    var angular = require('angular');
    var module = angular.module('pi.modal',[]);

    module.service('piModal', require('./modalService'));

    return module;
});