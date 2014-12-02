/**
 * Should manage various tasks.
 * For now it should simply load and activate a questionnaire.
 * Eventually it should be able to take a sequence of tasks and run them.
 * @name  managerDirctive
 * @return {directive}
 */
define(function(require){

	var _ = require('underscore');

	managerControler.$inject = ['$scope', 'managerService', 'managerLoad', 'piConsole'];
	function managerControler($scope, ManagerService, managerLoad, piConsole){
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

			managerLoad(taskSource).then(success,error);

			function success(script){

				// takes taskSource and returns a path or undefined
				function getPath(path){
					if (!_.isString(path)) {
						return;
					} else {
						return path.substring(0, path.lastIndexOf('/'));
					}
				}

				// keep the script on scope
				$scope.script = script;
				$scope.settings = (script && script.settings) || {};

				// create the manager
				ctrl.manager = new ManagerService($scope, script);
				ctrl.manager.setBaseUrl(getPath(taskSource));

				// activate first task
				$scope.$emit('manager:next');
			}

			function error(e){
				piConsole('manager').error(e);
			}
		}
	}

	directive.$inject = ['managerService', '$q', '$injector', 'piConsole'];
	function directive(managerService, $q, $injector,piConsole){
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
					piConsole('manager').debug('Manager:currentTask', currentTask);

					// procced or and manager
					currentTask ? proceed() : done();
				}

				function proceed(){
					var locals = {prevTask: prevTask, currentTask: currentTask};
					$qSequence([
						$scope.settings.onPreTask,
						prevTask && prevTask.post,
						currentTask.pre,
						_.bind(swap.next, swap, {task:currentTask}),
						function(){
							$scope.loading = false;
						}
					], locals);
				}

				function done(){
					var locals = {prevTask: prevTask, currentTask: currentTask};
					$qSequence([
						prevTask && prevTask.post,
						_.bind(swap.empty, swap),
						$scope.settings.onEnd,
						function(){
							$scope.loading = false;
							$scope.$emit('manager:done');
						}
					], locals);
				}

				function taskDone(ev){
					ev.stopPropagation();
					$scope.loading = true;
					$scope.$emit('manager:next');
				}

				/**
				 * chain a series of functions/promises/undefined
				 * @param  {Array} arr an array of functions etc.
				 * @return {promise}
				 */
				function $qSequence(arr, locals){
					var promise = $q.when();

					_(arr)
						// map into then functions
						.map(function(value){
							return function(){
								var prms = _.isFunction(value) ? $injector.invoke(value,null,locals||{}) : value;
								return $q.when(prms);
							};
						})
						.reduce(function(promise, value){
							return promise['finally'](value);
						}, promise);
				}

			}
		};
	}


	return directive;
});