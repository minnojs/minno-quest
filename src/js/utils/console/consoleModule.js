define(function(require){
	var angular = require('angular');
	var module = angular.module('piConsole',[]);

	module.service('piConsole', require('./consoleProvider'));

	// The settingsObject defined as a service singelton (good for testing...)
	module.service('piConsoleSettings',function(){
		this.tags = [];
	});

	return module;
});