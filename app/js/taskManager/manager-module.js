define(function(require){
	
	var angular = require('angular');
	var module = angular.module('taskManager',[]);

	module.service('managerGetScript', require('./getScriptProvider'));
	module.directive('piTask', require('./managerDirective'));

	return module;
});