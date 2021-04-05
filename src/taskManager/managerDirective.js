/**
 * @name  managerDirctive
 * @return {directive}
 */
import _ from 'lodash';
import getUrlParameters from './getUrlParameters';

managerControler.$inject = ['$scope', 'managerService', 'managerLoad', 'piConsole'];
function managerControler($scope, ManagerService, managerLoad, piConsole){
    this.init = init;

    function init(source){
        var ctrl = this;
        var taskSource;

        $scope.global.$url = getUrlParameters();

        if (!source) return;

        if (_.isString(source)){
            // if source is a plain string eval returns undefined so we want to load this as a url 
            try { taskSource = $scope.$eval(source); }
            catch(e){ /* don't do anything. This means that the source is not compilable... */ } 
            finally { taskSource || (taskSource = source); }
        }
        else taskSource = source;

        managerLoad(taskSource).then(success,error);

        function success(script){

            // keep the script on scope
            $scope.script = script;
            $scope.settings = (script && script.settings) || {};

            // create the manager
            $scope.manager = ctrl.manager = new ManagerService($scope, script);
            ctrl.manager.setBaseUrl(getBasePath(taskSource));

            // activate first task
            $scope.$emit('manager:next');
        }

        function error(e){
            piConsole({
                type:'error',
                message:'Failed to load ' + taskSource,
                tags:['manager'],
                error:e
            });
        }
        
        function getBasePath(path){
            if (!_.isString(path)) return;
            return path.substring(0, path.lastIndexOf('/'));
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

            $scope.$on('manager:loaded', loaded); // gets triggered after "task" is populated with $script and $template
            $scope.$on('task:done', taskDone);
            $scope.loading = true;

            function loaded(){
                $scope.loading = false;

                prevTask = currentTask; // keep previous task
                currentTask = thisCtrl.manager.current(); // get loaded task

                // procced or and manager
                currentTask ? proceed() : done();
            }

            function proceed(){
                var locals = {prevTask: prevTask, currentTask: currentTask, managerSettings: $scope.settings};
                $qSequence([
                    // progress update
                    function(){
                        var data = {
                            taskName: currentTask.name || 'namelessTask', 
                            taskNumber: _.get(currentTask,'$meta.number'),
                            taskURL:currentTask.scriptUrl || currentTask.templateUrl
                        };
                        thisCtrl.manager.log(data, $scope.settings);
                    },
                    $scope.settings.onPreTask,
                    currentTask.pre,
                    _.bind(swap.next, swap, {task:currentTask, settings:$scope.settings}),
                    currentTask.load,
                    function(){ $scope.loading = false; }
                ], locals);
            }

            function done(){
                var locals = {prevTask: prevTask, currentTask: currentTask};
                $qSequence([
                    _.bind(swap.empty, swap),
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
                var locals = {prevTask: prevTask, currentTask: currentTask, managerSettings: $scope.settings};
                ev.stopPropagation();

                $qSequence([
                    currentTask && currentTask.post,
                    function(){ $scope.loading = true; },
                    function(){ $scope.$emit('manager:next', args); }
                ], locals);
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
                            piConsole({
                                type:'error',
                                message:'There was an error in the task sequence.',
                                tags:['manager'],
                                error:e
                            });
                        });
                    }, promise);
            }

        }
    };
}


export default directive;
