/**
 * The module responsible for the single task.
 * It knows how to load a task and activate it.
 * It also supplies the basic task directive.
 * @return {module} pi.task module.
 */
define(function(require){

	var angular = require('angular');
	var module = angular.module('pi.task',[]);

	module.service('taskGetScript', require('./taskGetScriptProvider'));
	module.service('taskLoad', require('./taskLoadProvider'));
	module.provider('taskActivate', require('./taskActivateProvider'));
	module.directive('piTask', require('./taskDirective'));

	module.config(['taskActivateProvider', function(activateProvider){
		activateProvider.set('quest', function(done, props){
			var $compile = props.$injector.get('$compile');
			var $canvas = props.$element;
			var $scope = props.$scope;
			var $el;

			$canvas.append('<div pi-quest></div>');
			$el = $canvas.contents();
			$compile($el)($scope);

			// clean up piQuest
			$el.controller('piQuest').task.q.promise.then(function(){
				$el.scope().$destroy();
				$el.remove();
				done();
			});
		});
	}]);

	return module;
});