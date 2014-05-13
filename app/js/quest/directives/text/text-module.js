define(function(require){
	var angular = require('angular');
	var directive = require('./text-directive');
	var module = angular.module('questText',[]);

	module.directive('questText', directive);

	return module;
});
