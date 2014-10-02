define(function(require){

	var angular = require('angular');
	var module = angular.module('taskManager',[
		require('./task/taskModule').name
	]);

	// @TODO: WTF?
	module.value('managerGetScript', {});

	module.service('managerProvider', require('./managerProvider'));
	module.service('managerSequence', require('./managerSequence'));
	module.directive('piManager', require('./managerDirective'));
	module.directive('piSpinner', require('./spinner/spinnerDirective'));

	return module;
});