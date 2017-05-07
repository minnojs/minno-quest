define(function(require){
    var angular = require('angular');
    var module = angular.module('piHelperDirective', []);

    module.directive('piSwap', require('./piSwap/piSwapDirective'));
    module.directive('piSpinner', require('./piSpinner/piSpinnerDirective'));

    return module;
});