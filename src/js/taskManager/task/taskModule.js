/**
 * The module responsible for the single task.
 * It knows how to load a task and activate it.
 * It also supplies the basic task directive.
 * @return {module} pi.task module.
 */
define(function(require){

	var angular = require('angular');
	var module = angular.module('pi.task',[]);
	var _ = require('underscore');

	module.provider('taskActivate', require('./taskActivateProvider'));
	module.directive('piTask', require('./taskDirective'));

	// the tasks defined here essentialy activate the default players for quest/message/pip.

	module.config(['taskActivateProvider', function(activateProvider){

		activateQuest.$inject = ['done', '$element', '$scope', '$compile', 'script','task'];
		function activateQuest(done, $canvas, $scope, $compile, script, task){
			var $el;

			// update script name
			task.name && (script.name = task.name);

			$scope.script = script;

			$canvas.append('<div pi-quest></div>');
			$el = $canvas.contents();
			$compile($el)($scope);

			// clean up piQuest
			$el.controller('piQuest').task.promise['finally'](function(){
				$el.scope().$destroy();
				$el.remove();
				done();
			});

		}

		activateProvider.set('quest', activateQuest);
	}]);

	module.config(['taskActivateProvider', function(activateProvider){
		activateMessage.$inject = ['done', '$element', 'task', '$scope','$compile'];
		function activateMessage(done, $canvas, task, $scope, $compile){
			var $el;

			$scope.script = task;



			$canvas.append('<div pi-message></div>');
			$el = $canvas.contents();
			$compile($el)($scope);

			// clean up
			$scope.$on('message:done', function(){
				$scope.$destroy();
				$el.remove();
				done();
			});
		}

		activateProvider.set('message', activateMessage);
	}]);

	module.config(['taskActivateProvider', function(activateProvider){
		activatePIP.$inject = ['done', '$element', 'task', 'script'];
		function activatePIP(done, $canvas, task, script){
			var $el, req;

			// load PIP
			req = requirejs.config({
				context: _.uniqueId(),
				baseUrl:'../bower_components/PIPlayer/dist/js', // can't use packages yet as urls in pip aren't relative...
				paths: {
					//plugins
					text: ['//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.3/text.min', "../../../requirejs-text/text"],

					// Core Libraries
					jquery: ["//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min","../../../jquery/dist/jquery.min"],
					underscore: ["//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min","../../../lodash-compat/lodash.min"],
					backbone: ['//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min', "../../../backbone/backbone"]
				},

				deps: ['jquery', 'backbone', 'underscore']
			});

			// update script name
			task.name && (script.name = task.name);

			$canvas.append('<div pi-player></div>');
			$el = $canvas.contents();
			$el.addClass('pi-spinner');

			req(['activatePIP'], function(activate){
				$el.removeClass('pi-spinner');
				activate(script, done);
			});
		}

		activateProvider.set('pip', activatePIP);
	}]);

	return module;
});