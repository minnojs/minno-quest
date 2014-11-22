define(function(require){
	var angular = require('angular');
	var module = angular.module('pi.message',[]);

	module.directive('piMessage', require('./messageDirective'));
	module.directive('piMessageDone', require('./messageDoneDirective'));

	return module;
});