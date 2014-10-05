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

	module.animation('.drop-in', ['$interval', function($interval){

		var topdx = 60;
		var duration = 500;
		var iterations = 100;

		return {
			enter: function(element, done){
				var opacity = 0, top = -topdx;

				// setup
				element.css({
					opacity: 0,
					top: topdx +'px'
				});

				$interval(function(){
					element.css({
						opacity: opacity+=1/iterations,
						top: (top+=topdx/iterations) +'px'
					});
				}, duration/iterations, iterations, false).then(done);

				return function(canceled){
					if (canceled){
						element.css({opacity: 1,top: '0px'});
					}
				};
			},

			leave: function(element, done){
				var opacity = 1, top = 0;
				$interval(function(){
					element.css({
						opacity: opacity-=1/iterations,
						top: (top-=topdx/iterations) +'px'
					});
				}, duration/iterations, iterations, false).then(done);

				return function(canceled){
					if (canceled){
						element.css({opacity: 0});
					}
				};
			}

		};
	}]);

	return module;
});