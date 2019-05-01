/*
 * @name: taskDirective
 */


import _ from 'lodash';

directive.$inject = ['taskActivate','managerCanvas','$document', '$window', '$rootScope', 'piConsole'];
function directive(activateTask, canvas, $document, $window, $rootScope, piConsole){
    return {
        scope:{
            task: '=piTask'
        },
        link: function($scope, $element){
            var task = $scope.task;
            var script = task.$script || {};
            var taskName = task.$name;
            var managerSettings = $scope.$parent.settings || {};
            var logger = $scope.$parent.manager.logger;
            var piGlobal = window.piGlobal;

            var canvasOff, oldTitle;
            var def;
            var promise;
            var proceedObject;

            if (!task) return;

            /**
             * listen for skip events
             */
            if (managerSettings.skip && window.DEBUG === true){
                $document.on('keydown',proceedListener);
                $scope.$on('$destroy', function(){
                    $document.off('keydown', proceedListener);
                    $document.off('keydown', skipListener);
                });
            }

            /**
             * Setup current object
             */
            $rootScope.current = piGlobal.current = script.current || {};
            if (taskName){
                if (piGlobal[taskName]) piConsole({
                    type:'warn',
                    tags:['task'],
                    message:'This taskName has already been in use: "' + taskName + '"'
                });
                // extend current script with the piGlobal object
                _.extend($rootScope.current, piGlobal[taskName] || {});
                // set the current object back into the global
                $window.piGlobal[taskName] = script.current;
            }

            /**
             * Activate task
             */
            def = activateTask(task, $element, $scope.$new(), logger);
            promise = def.promise;

            /**
             * Add and remove canvas
             */
            canvasOff = canvas(task.canvas); // apply canvas settings
            promise['finally'](canvasOff); // remove canvas settings

            promise['finally'](function(){
                $scope.$emit('task:done', proceedObject);
            });

            /**
                 * Listen for skip events
                 * F5 = refresh
                 * esc = set up arrows for prev/next
                 * @param  {Event} e
                 */
            function proceedListener(e){
                var which = e.which || e.keyCode;
                var key = (e.key || '').toUpperCase();

                // ctrl r ==> refresh
                if ((which == 82 || key == 'R') && e.ctrlKey) {
                    proceed(e, 'current');
                    e.preventDefault();
                }

                // esc ==> listen for skip direction (once)
                if(which == 27) {
                    $document.one('keydown', skipListener);
                }
            }

            // skip on left/right key codes
            function skipListener(e){
                var which = e.which || e.keyCode;
                if (which == 37) {proceed(e, 'prev');}
                if (which == 39) {proceed(e, 'next');}
            }

            // end task and proceed where needed
            function proceed(e, target){
                e.preventDefault();
                proceedObject = {type:target, bustCache:true}; // when the deferred is resolved this object is used to tell piqPage where to proceed.
                def.resolve();
            }

        }
    };
}

export default directive;
