define(function(require){
	var angular = require('angular');
	var directive = require('./text-directive');
	var module = angular.module('quest.text',[]);

	module.directive('questText', directive);

	return module;
});
