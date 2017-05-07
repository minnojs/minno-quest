define(function(require){
    var angular = require('angular');
    var Logger = require('./LoggerProvider');

    var module = angular.module('logger', [require('utils/console/consoleModule').name]);
    module.provider('Logger', Logger);

    return module;
});