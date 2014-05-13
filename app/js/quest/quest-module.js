/*
 *	One module to rule them all.
 *	This module is responsible to pull together all the piquest components.
 *	Calling it should suffice to activate the whole piquest stuff.
 */
define(function(require){
	require('directives/quest-directives-module');
	var module = angular.module('piQuest', ['questDirectives']);

	return module;
});