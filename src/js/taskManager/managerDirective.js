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
                piConsole('manager').error('Failed to load ' + taskSource, e);
            }
        }
    }

    directive.$inject = ['$q', '$injector', 'piConsole'];
    function directive($q, $injector,piConsole){
        return {
            priority: 1000,
            replace:true,
            template: [ 
                '<div pi-swap ng-cloak ng-class="{\'pi-spinner\':loading}">',
                '<div ng-bind-html="task.preText"></div>',
                '<div pi-task="task"></div>',
                '<div ng-bind-html="task.postText"></div>',
                '</div>',
            ].join('\n'),
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
                    var locals = {prevTask: prevTask, currentTask: currentTask, managerSettings: $scope.settings};
                    $qSequence([
                        $scope.settings.onPreTask,
                        _.get(prevTask,'post'),
                        currentTask.pre,
                        _.bind(swap.next, swap, {task:currentTask, settings:$scope.settings}),
                        currentTask.load,
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
                            $scope.$destroy();
                        }
                    ], locals);
                }

				/**
				 * This is called uppon task:done
				 * It is responsible for proceeding to the following task
				 * @param  {Event} ev   The event that triggered the taskdone
				 * @param  {Object} args An object that describes the direction of proceeding
				 */
                function taskDone(ev, args){
                    ev.stopPropagation();
                    $scope.loading = true;
                    $scope.$emit('manager:next', args);
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
						.reduce(function(promise, fn){
    return promise.then(fn, function(e){
        piConsole('manager').error('There was an error in the task sequence. ',e);
    });
}, promise);
                }

            }
        };
    }


    return directive;
});
