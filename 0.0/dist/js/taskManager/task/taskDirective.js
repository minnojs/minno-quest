/*
 * @name: taskDirective
 */
define(function(require){

	var _ = require('underscore');

	directive.$inject = ['taskActivate','managerCanvas','$document', '$window', '$rootScope'];
	function directive(activateTask, canvas, $document, $window, $rootScope){
		return {
			scope:{
				task: '=piTask'
			},
			link: function($scope, $element){
				var task = $scope.task;
				var canvasOff, oldTitle;
				var def;
				var promise;
				var proceedObject;
				var settings = $scope.$parent.settings || {};
				var script = task.$script || {};
				var taskName = task.name || script.name;

				if (!task){
					return;
				}

				/**
				 * listen for skip events
				 */
				if (settings.skip){
					$document.on('keydown',proceedListener);
					$scope.$on('$destroy', function(){
						$document.off('keydown', proceedListener);
						$document.off('keydown', skipListener);
					});
				}

				/**
				 * Setup current object
				 */
				$rootScope.current = $window.piGlobal.current = script.current || {};
				if (taskName){
					// extend current script with the piGlobal object
					_.extend($rootScope.current, $window.piGlobal[taskName] || {});
					// set the current object back into the global
					$window.piGlobal[taskName] = script.current;
				}

				/**
				 * Activate task
				 */
				def = activateTask(task, $element, $scope.$new());
				promise = def.promise;

				/**
				 * Add and remove canvas
				 */
				canvasOff = canvas(task.canvas); // apply canvas settings
				promise['finally'](canvasOff); // remove canvas settings

				/**
				 * Add and remove title
				 * if task.title is set, set the title and remove at the end...
				 */
				if (task.title){
					oldTitle = $document[0].title;
					$document[0].title = task.title;
					promise['finally'](function(){$document[0].title = oldTitle;});
				}

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
					var which = e.key || e.which || e.keyCode;

					// ctrl r ==> refresh
					if (which == 82 && e.ctrlKey) {
						proceed(e, 'current');
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

	return directive;
});