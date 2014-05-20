/**
 * Main tag for piQuest component.
 * All you need in order to use it is set a script in the $rootScope and insert the tag.
 *
 * This directive is responsible for:
 *		1. Creating the task object.
 *		2. Relaying pages from the sequence to piqPage.
 *		3. Harvesting results from the pages and logging them.
 *		4. For now, deal with the end of a task (redirect, callback, broadcast etc. - later this should move into the tas)
 *
 * @name piQuest
  */
define(function (require) {
	var _ = require('underscore');
	var template = require('text!./piQuest.html');

	piQuestCtrl.$inject = ['$scope','Task','$rootScope'];
	function piQuestCtrl($scope, Task, $rootScope){
		var self = this,
			script = $rootScope.script,
			questStack = [],
			task = this.task = new Task(script);

		this.id = 'piQuest';

		this.init = function(){
			self.next();
		};

		this.next = function(){
			$scope.page = task.proceed();
		};

		this.addQuest = function(quest){
			questStack.push(quest);
		};

		this.removeQuest = function(quest){
			var index = _.indexOf(questStack, quest);
			if (index > 0){
				questStack.splice(index,1);
			}
		};

		this.harvest = function(){
			_.each(questStack, function(quest){
				var result = quest.value();
				task.log(result);
				questStack = [];
			});
		};
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