/**
 * The module responsible for the single task.
 * It knows how to load a task and activate it.
 * It also supplies the basic task directive.
 * @return {module} pi.task module.
 */
define(function(require){

	var angular = require('angular');
	var module = angular.module('pi.task',[]);

	module.provider('taskActivate', require('./taskActivateProvider'));
	module.directive('piTask', require('./taskDirective'));

	module.config(['taskActivateProvider', function(activateProvider){

		activateQuest.$inject = ['done', '$element', '$scope', '$compile', 'script'];
		function activateQuest(done, $canvas, $scope, $compile, script){
			var $el;

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

	return module;
});