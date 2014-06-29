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

	piQuestCtrl.$inject = ['$scope','Task'];
	function piQuestCtrl($scope, Task){
		var self = this;
		var task = self.task = new Task($scope.script);

		this.init = next;

		// create the local object
		$scope.global[$scope.script.name || 'current'] = $scope.current = {
			questions: {}
		};

		$scope.$on('quest:next', next);

		$scope.$on('quest:log', function(event, logs, pageData){
			_.each(logs, function(log){
				task.log(log, pageData, $scope.global);
			});
		});

		function next(event, target){
			var page = task.next(target);
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