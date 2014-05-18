define(function(require){
	var angular = require('angular');
	var Logger = require('./LoggerProvider');

	var module = angular.module('logger', []);
	module.provider('Logger', Logger);

	return module;
});