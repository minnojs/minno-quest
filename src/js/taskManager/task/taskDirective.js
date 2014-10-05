/*
 * @name: taskDirective
 */
define(function (require) {
	// get template
	var template = require('text!./taskTemplate.html');

	directive.$inject = ['$rootScope','$compile','taskLoad', 'taskActivate'];
	function directive($rootScope,$compile, loadTask, activateTask){
		return {
			replace: true,
			template:template,
			require: [],
			// controller: '',
			// controllerAs: 'ctrl',
			scope:{
				data: '=piTask'
			},
			link: function($scope, $element){

				var global = $rootScope.global;

				$scope.$watch('data', function (newTask) {

					// don't do anything at the very begining or end
					if (!newTask){
						return;
					}

					var $canvas = $element.children().eq(1);

					// show loading spinner
					$scope.loading = true;

					// load the task script
					loadTask(newTask)
						.then(function(script){
							// hide spinner
							$scope.loading = false;

							// expose script in scope
							$scope.script = script;

							// activate pre
							newTask.pre && newTask.pre(global);

							// activate task
							activateTask(newTask, script, $canvas, $scope)
								.then(function(){
									// activate post
									// @TODO: support returning a deferred
									newTask.post && newTask.post(global);
									$canvas.empty();
									$scope.$emit('task:end', arguments);
								});
						});
				});
			}
		};
	}

	return directive;
});