/**
 * Main tag for piQuest component.
 * All you need in order to use it is set a script in the $rootScope and insert the tag.
 *
 * This directive is responsible for:
 *		1. Creating the task object.
 *		2. Relaying pages from the sequence to piqPage.
 *		3. For now, deal with the end of a task (redirect, callback, broadcast etc. - later this should move into the tas)
 *
 * @name piQuest
  */
define(function (require) {
	var _ = require('underscore');
	var template = require('text!./piQuest.html');

	piQuestCtrl.$inject = ['$scope','Task','$rootScope'];
	function piQuestCtrl($scope, Task, $rootScope){
		var script = $rootScope.script;

		if (!script){
			throw new Error('piQuest: script missing!');
		}

		var task = this.task = new Task(script);

		this.init = function(){
			$scope.page = task.proceed();
		};

		$scope.$on('quest:next', function(event, target){
			$scope.page = task.proceed(target);
		});

		$scope.$on('quest:log', function(event, logs, pageData){
			_.each(logs, function(log){
				task.log(log, pageData, $rootScope.global);
			});
		});
	}

	function directive(){
		return {
			replace: true,
			controller: piQuestCtrl,
			template:template,
			link: function(scope, element, attr, ctrl) {
				// initiate controller
				ctrl.init();
			}
		};
	}

	return directive;
});