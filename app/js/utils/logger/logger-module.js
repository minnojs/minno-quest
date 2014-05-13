define(function(require){
	var angular = require('angular');
	var module = angular.module('logger', []);

	module.value('Logger', function(settings){
		this.log = function(){console.log('logger called');};
		this.settings = settings;
	});

	return module;
});