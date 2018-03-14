/**
 * Main tag for piQuest component.
 * All you need in order to use it is set a script in the $rootScope and insert the tag.
 *
 * This directive is responsible for:
 *		1. Creating the task object.
 *		2. Relaying pages from the sequence to piqPage.
 *		3. For now, deal with the end of a task (redirect, callback, broadcast etc. - later this should move into the task)
 *
 * @name piQuest
	*/
define(function (require) {
    var _ = require('underscore');
    var template = require('text!./piQuest.html');
    var jqLite = require('angular').element;

    piQuestCtrl.$inject = ['$scope','$rootScope','QuestTask','templateDefaultContext', 'mixerDefaultContext', 'piModal'];
    function piQuestCtrl($scope, $rootScope, QuestTask, templateDefaultContext, mixerDefaultContext, piModal){
        var task = new QuestTask($scope.script);
        var defaultContext; // for templates and the mixer
        var global = $rootScope.global; // setup in app.run
        var current = $rootScope.current || {}; // setup in taskDirective

        this.task = task;
        this.timerSetup = timerSetup;

        current.questions || (current.questions = {});

		// create default context
        defaultContext = {
            global: global,
            current: current,
            questions: current.questions
        };

		// set default contexts
        _.extend(templateDefaultContext,defaultContext);
        _.extend(mixerDefaultContext,defaultContext);

		// setup the first page
        task.next();

        $scope.$on('quest:next', next);
        $scope.$on('quest:prev', prev);

        $scope.$on('quest:log', function(event, log, pageData){
            task.log(log, pageData, $scope.global);
        });

        function next(event, target){
            task.next(target);
            $scope.$emit('quest:newPage');
        }

        function prev(event, target){
            task.prev(target);
            $scope.$emit('quest:newPage');
        }

        function timerSetup (timerCtrl) {
            var settings = _.get($scope, 'script.settings.timer');
            if (!settings){
                return;
            }

            timerCtrl.start(settings);
            timerCtrl.getScope().$on('timer-end', function(){
                var message = settings.message;

				// proceed
                if (message){
					// create message object out of string
                    _.isString(message) && (message = {body: message});

					// extend message object with scope and context
                    _.defaults(message, {
                        $context: defaultContext
                    });

					// activate message and only then proceed
                    piModal.open(message).then(timerProceed);
                } else {
					// if there is no messgae proceed imidiately
                    timerProceed();
                }

                function timerProceed() {
                    task.end();
                }

            });

            $scope.$on('$destroy', _.bind(timerCtrl.stop, timerCtrl));
        }

    }

    directive.$inject = ['$compile', '$animate','$injector','piConsole'];
    function directive($compile, $animate, $injector, piConsole){
        return {
            controller: piQuestCtrl,
            terminal:true,
            replace:true,
            template: '<div pi-timer></div>',
            require: ['piQuest','piTimer'],
            link: function(scope, parentElement, attr, ctrls) {
                var ctrl = ctrls[0],
                    task = ctrl.task,
                    piTimer = ctrls[1],
                    currentScope,
                    currentElement,
                    previousElement;

                ctrl.timerSetup(piTimer);

                scope.$on('quest:refresh', refresh); // just refresh the object
                scope.$on('quest:newPage', newPage); // new element, new object and animation
                newPage();

                function cleanupLastPage() {
                    if(previousElement) {
                        previousElement.remove();
                        previousElement = null;
                    }
                    if(currentScope) {
                        currentScope.$destroy();
                        currentScope = null;
                    }
                    if(currentElement) {
                        $animate.leave(currentElement, function() {
                            previousElement = null;
                        });
                        previousElement = currentElement;
                        currentElement = null;
                    }
                }

                function newPage(){
                    var page = task.current();

                    if (page){
                        var newScope = scope.$new();
                        var tempElm = jqLite(template); // create a new element here so we can add the animation classes before linking

                        newScope.page = page;
                        addAnimations(tempElm, page.animate);

						// first send away the previous element (if it exists)
                        cleanupLastPage();

						// enter: new element
                        currentElement = $compile(tempElm)(newScope);

                        $animate.enter(currentElement, parentElement);

                        currentScope = newScope;
                        currentScope.$emit('quest:updated');
                    } else {
                        cleanupLastPage();
                    }
                }

                function refresh(){
                    currentScope.page = task.current();
                }

                function addAnimations(element, animationsStr){
                    if (!animationsStr){
                        return;
                    }

                    var animations = animationsStr.split(' ');

                    _.each(animations, function(animation){
						// Make sure that this animation exists
                        if (!$injector.has('.' + animation + '-animation')){
                            piConsole(['page','animation']).error('Unknown animation type: "' + animation + '"');
                        }

                    });

                    element.addClass(animationsStr);
                }
            }
        };
    }

    return directive;
});
