define(function(require){
	require('sequence/sequence-module');
	var angular = require('angular');
	var directive = require('./piQuest-directive');
	var module = angular.module('quest.piQuest',['sequence']);

	module.directive('piQuest', directive);

	return module;
});
