/*
 *	One module to rule them all.
 *	This module is responsible to pull together all the piquest components.
 *	Calling it should suffice to activate the whole piquest stuff.
 */
define(function(require){

	require('quest/directives/questDirectivesModule');
	require('quest/task/task-module');

	var module = angular.module('piQuest', ['questDirectives','task']);
	module.config(['$sceProvider', function($sceProvider){
		$sceProvider.enabled(false);
	}]);

	return module;
});