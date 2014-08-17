/**
 * Main tag for piQuest component.
 * All you need in order to use it is set a script in the $rootScope and insert the tag.
 *
 * This directive is responsible for:
 *		1. Creating the task object.
 *		2. Relaying pages from the sequence to piqPage.
 *		3. For now, deal with the end of a task (redirect, callback, broadcast etc. - later this should move into the task)
 *
 * @name piQuest
  */
define(['underscore', 'text!./piQuest.html'], function (_, template) {

	piQuestCtrl.$inject = ['$scope','$rootScope','Task','templateDefaultContext', 'mixerDefaultContext'];
	function piQuestCtrl($scope, $rootScope, Task, templateDefaultContext, mixerDefaultContext){
		var self = this;
		var task = self.task = new Task($scope.script);
		var defaultContext;


		var global = $rootScope.global;
		var script = $scope.script;

		// create the "current" object and expose "questions"
		var current = $rootScope.global[script.name || 'current'] = $rootScope.current = {questions: {}};

		// extend global and current with settings...
		if (script.current) {
			_.extend(current, script.current);
		}

		if (script.global) {
			_.extend(global, script.global);
		}

		this.init = next;

		// create default context
		defaultContext = {
			global: global,
			current: current,
			questions: $scope.current.questions
		};

		// set default contexts
		_.extend(templateDefaultContext,defaultContext);
		_.extend(mixerDefaultContext,defaultContext);

		$scope.$on('quest:next', next);
		$scope.$on('quest:prev', prev);
		$scope.$on('quest:refresh', refresh);

		$scope.$on('quest:log', function(event, logs, pageData){
			_.each(logs, function(log){
				task.log(log, pageData, $scope.global);
			});
		});

		function next(event, target){
			task.next(target);
			refresh();
		}

		function prev(event, target){
			task.prev(target);
			refresh();
		}

		function refresh(){
			var page = task.current();

			if (page) {
				$scope.page = page;
			}
		}
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