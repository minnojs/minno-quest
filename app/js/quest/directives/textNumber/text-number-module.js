define(function(require){
	var angular = require('angular');
	var directive = require('./text-number-directive');
	var module = angular.module('questTextNumber',[]);

	module.directive('questTextNumber', directive);


	return module;
});
