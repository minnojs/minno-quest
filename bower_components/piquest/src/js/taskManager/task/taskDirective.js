/*
 * @name: taskDirective
 */
define(function(){
	directive.$inject = ['taskActivate','managerCanvas'];
	function directive(activateTask, canvas){
		return {
			scope:{
				task: '=piTask'
			},
			link: function($scope, $element){
				var task = $scope.task;
				var off;

				if (!task){
					return;
				}

				off = canvas(task.canvas); // apply canvas settings

				activateTask(task, $element, $scope.$new())
					['finally'](off) // remove canvas settings
					['finally'](function(){
						$scope.$emit('task:done', arguments);
					});
			}
		};
	}

	return directive;
});