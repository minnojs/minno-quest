define(function(require){
	var angular = require('angular');
	var directive = require('./wrapper-directive');
	var module = angular.module('questWrapper',[]);

	module.directive('questWrapper', directive);

	return module;
});
