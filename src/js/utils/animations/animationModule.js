define(function(require){
    var angular = require('angular');
    require('animate');
    require('./rafPolyfill');

    var module = angular.module('pi.animate',['ngAnimate']);

    module.animation('.drop-in', require('./dropInAnimation'));
    module.animation('.fade', require('./fadeAnimation'));
    module.animation('.slide', require('./slideAnimation'));

    return module;
});