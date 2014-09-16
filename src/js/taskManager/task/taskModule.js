/**
 * The module responsible for the single task.
 * It knows how to load a task and activate it.
 * It also supplies the basic task directive.
 * @return {module} pi.task module.
 */
define(function(require){

	var angular = require('angular');
	var module = angular.module('pi.task',[]);

	module.service('taskGetScript', require('./getScriptProvider'));
	module.service('taskLoad', require('./taskLoadProvider'));
	module.service('taskActivate', require('./taskActivateProvider'));
	module.directive('piTask', require('./taskDirective'));

	return module;
});