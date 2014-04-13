define(function(require){
	var angular = require('angular');
	var directive = require('./text-number-directive');
	var module = angular.module('quest.textNumber',[]);

	module.directive('questTextNumber', directive);


	return module;
});
