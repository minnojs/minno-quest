/*
 *	One module to rule them all.
 *	This module is responsible to pull together all the piquest components.
 *	Calling it should suffice to activate the whole piquest stuff.
 */
define(function(require){

	require('quest/directives/quest-directives-module');
	require('quest/task/task-module');

	var module = angular.module('piQuest', ['questDirectives','task']);

	return module;
});