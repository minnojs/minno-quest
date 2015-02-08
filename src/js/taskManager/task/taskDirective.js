/*
 * @name: taskDirective
 */
define(function(){
	directive.$inject = ['taskActivate','managerCanvas','$document'];
	function directive(activateTask, canvas, $document){
		return {
			scope:{
				task: '=piTask'
			},
			link: function($scope, $element){
				var task = $scope.task;
				var canvasOff, oldTitle;
				var def;

				if (!task){
					return;
				}

				def = activateTask(task, $element, $scope.$new());

				canvasOff = canvas(task.canvas); // apply canvas settings
				def['finally'](canvasOff); // remove canvas settings

				// if task.title is set, set the title and remove at the end...
				if (task.title){
					oldTitle = $document[0].title;
					$document[0].title = task.title;
					def['finally'](function(){$document[0].title = oldTitle;});
				}

				def['finally'](function(){
					$scope.$emit('task:done', arguments);
				});
			}
		};
	}

	return directive;
});