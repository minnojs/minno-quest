define(function(require){

	var angular = require('angular');
	var module = angular.module('taskManager',[
		require('./task/taskModule').name
	]);

	module.value('managerGetScript', {});
	module.directive('piManager', require('./managerDirective'));

	return module;
});