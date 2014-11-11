/*
 * @name: taskDirective
 */
define(function(){
	directive.$inject = ['taskActivate'];
	function directive(activateTask){
		return {
			scope:{
				task: '=piTask'
			},
			link: function($scope, $element){
				var task = $scope.task;

				if (!task){
					return;
				}

				activateTask(task, $element, $scope.$new())
					.then(function(){
						$scope.$emit('task:done', arguments);
					});
			}
		};
	}

	return directive;
});