/*
 *	One module to rule them all.
 *	This module is responsible to pull together all the piquest components.
 *	Calling it should suffice to activate the whole piquest stuff.
 */
define(function(require){

	require('quest/directives/questDirectivesModule');
	require('quest/task/task-module');

	var module = angular.module('piQuest', ['questDirectives','task']);

	// @TODO: move to utils or something
	module.config(['$sceProvider', function($sceProvider){
		$sceProvider.enabled(false);
	}]);

	// app.filter('unsafe', function($sce) {
	//     return function(val) {
	//         return $sce.trustAsHtml(val);
	//     };
	// });

	return module;
});