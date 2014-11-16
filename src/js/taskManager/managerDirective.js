/**
 * Should manage various tasks.
 * For now it should simply load and activate a questionnaire.
 * Eventually it should be able to take a sequence of tasks and run them.
 * @name  managerDirctive
 * @return {directive}
 */
define(function(require){

	var _ = require('underscore');

	managerControler.$inject = ['$scope', 'managerService', 'managerLoad'];
	function managerControler($scope, ManagerService, managerLoad){
		this.init = init;


		function init(source){
			var ctrl = this;
			var taskSource;

			try {
				taskSource = $scope.$eval(source); // if source is a plain string eval returns undefined so we want to load this as a url
			} catch(e){
				// don't do anything. This means that the source is un compilable...
			} finally {
				taskSource || (taskSource = source);
			}

			managerLoad(taskSource).then(function(script){
				// keep the script on scope
				$scope.script = script;
				$scope.settings = (script && script.settings) || {};

				// create the manager
				ctrl.manager = new ManagerService($scope, script);

				// activate first task
				$scope.$emit('manager:next');
			});
		}
	}

	directive.$inject = ['managerService', '$q'];
	function directive(managerService, $q){
		return {
			priority: 1000,
			replace:true,
			template: '<div pi-swap><div pi-task="task" ng-class="{\'pi-spinner\':loading}"></div></div>',
			controller: managerControler,
			require: ['piManager', 'piSwap'],
			link:  function($scope, $element, attr, ctrl){
				var swap = ctrl[1], thisCtrl = ctrl[0];
				var currentTask, prevTask;

				thisCtrl.init(attr.piManager);

				$scope.$on('manager:loaded', loaded);
				$scope.$on('task:done', taskDone);
				$scope.loading = true;

				function loaded(){
					$scope.loading = false;

					// keep previous task
					prevTask = currentTask;

					// get loaded task
					currentTask = thisCtrl.manager.current();

					// procced or and manager
					currentTask ? proceed() : done();
				}

				function proceed(){
					$q
						.when(_.result(prevTask, 'post'))
						.then(function(){
							return $q.when(_.result(currentTask, 'pre'));
						})
						.then(function(){
							return $q.when(swap.next({task:currentTask}));
						});
				}

				function done(){
					$q
						.when(_.result(prevTask, 'post'))
						.then(function(){
							return $q.when(swap.empty());
						})
						.then(function(){
							return $q.when(_.result($scope.settings, 'onEnd'));
						})
						.then(function(){
							$scope.$emit('manager:done');
						});
				}

				function taskDone(ev){
					ev.stopPropagation();
					$scope.loading = true;
					$scope.$emit('manager:next');
				}
			}
		};
	}

	return directive;
});