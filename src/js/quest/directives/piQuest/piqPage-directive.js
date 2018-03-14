/**
 * Main tag for piqPage component.
 * Used automaticaly from within the piQuest directive.
 *
 * This directive is responsible for:
 * 1. Displaying page questions.
 * 2. Detecting the end of a page (submit, TO).
 * 3. Harvesting information from the questions.
 * 4. Suplying information to the logger.
 *
 * @name piqPage
  */
define(function (require) {
    var template = require('text!./piqPage.html');
    var _ = require('underscore');
    var angular = require('angular');

    piqPageCtrl.$inject = ['$scope','$timeout', '$rootScope', 'piModal'];
    function piqPageCtrl($scope,$timeout, $rootScope, piModal){
        var self = this;

        $scope.global = $rootScope.global;
        $scope.current = $rootScope.current;

        /**
		 * Harvest piqPage questions, and log them.
		 * by default logging is deferred to the end (so that we can go back to questions...)
		 * This can be changed by setting lognow to true (page.lognow)
		 */
        this.harvest = function(lognow){
            var questions = $scope.current.questions;

            _.each($scope.page.questions, function(q){
                // don't log if we don't have a name or if lognow is'nt true
                if (!q.name || !(lognow || q.lognow)){return;}

                // get the appropriate log object
                var log = questions[q.name];

                // don't log if this has already been logged
                if (log.$logged){return;}

                // emit to quest directive
                $scope.$emit('quest:log', log, self.log);
                log.$logged = true;
            });
        };

        /**
		 * Proceed to next page.
		 *
		 * @name submit
		 * @param  {Boolean} skipValidation [Should skip validation of the form before submitting?]
		 */
        $scope.submit = function(skipValidation){

            var valid = $scope.pageForm.$valid;

            // mark this attempt for submitting
            // useful for validation...
            $scope.submitAttempt = true;

            if (!valid && skipValidation !== true){
                return true;
            }

            // broadcast to the quest controller
            // so that it can set submit latency
            $scope.$broadcast('quest:submit');

            self.proceed();

            // emit to the piQuest directive so that it knows to advance to the next page
            $scope.$emit('quest:next');
        };

        /**
		 * Decline to answer. mark all questions on this page as declined
		 */
        $scope.decline = function($event){
            var $el = angular.element($event.target);
            var notDoubleClick = (this.page.decline !== 'double');

            // decline and proceed to next page
            // unless this is a double style decline and then simply set "active".
            if (notDoubleClick || $el.hasClass('active')){
                // broadcast to the quest controller (so that it marks logs as declined and marks decline time)
                $scope.$broadcast('quest:decline');
                self.proceed();
                $scope.$emit('quest:next');
            } else {
                $el.addClass('active');
            }
        };

        /**
		 * Go back to previous page.
		 */
        $scope.prev = function(){
            // broadcast to the quest controller
            self.proceed();
            $scope.$emit('quest:prev');
        };


        /**
		 * Wraps up page setup
		 * Closes timer stuff.
		 * Harvests if needed.
		 */
        this.proceed = function(){

            // remove timeout if needed
            self.timer.stop();

            // by default, harvest after every page..
            self.harvest($scope.page.lognow);
        };

        this.setup = pageSetup;

        // refresh page on question change (deep watch)
        // should refresh this directive without animating the whole page in...
        $scope.$watch('current.questions', pageRefresh, true);

        // listen for auto submit calls (from textDirective etc.)
        $scope.$on('quest:submit:now', function(){
            $scope.submit();
        });

        // refresh $scope.page
        // indirectly triggers pageSetup
        function pageRefresh(){
            $scope.$emit('quest:refresh');
        }

        function pageSetup(timer){
            var newPage = $scope.page;
            self.timer = timer;

            // set the page log object
            self.log = {
                name: newPage.name,
                startTime: +new Date()
            };

            // If there is a timeout set, submit when it runs out.
            if (newPage.timer){
                timer.start(newPage.timer);
                timer.getScope().$on('timer-end', timerEnd);
            }

            function timerEnd(){
                var message = newPage.timer.message; // timer must be defined to get here...
                var context;

                // mark logs as timeout
                self.log.timeout = true;
                $scope.$broadcast('quest:timeout');

                // if there is no messgae proceed imidiately
                if (!message) return timerProceed();

                // create context for message tempates
                context = {
                    pagesMeta: newPage.$meta,
                    pagesData: newPage.data,
                    global: $rootScope.global,
                    current: $rootScope.current
                };

                // create message object out of string
                _.isString(message) && (message = {body: message});

                // extend message object with scope and context
                _.defaults(message, {
                    $context: context,
                    $scope: $scope
                });

                // activate message and only then proceed
                piModal.open(message).then(timerProceed);
            } 

            function timerProceed(){
                var submit = newPage.timer.submitOnEnd || _.isUndefined(newPage.timer.submitOnEnd);
                submit && $scope.submit(true);
            }
        }
    }

    directive.$inject = ['$window'];
    function directive($window){
        return {
            replace: true,
            controller: piqPageCtrl,
            template:template,
            require: ['piqPage','piTimer'],
            link: function($scope, $el, $attr, $ctrl){
                var page = $scope.page;
                $window.scrollTo(0,0);
                // setup timer
                $ctrl[0].setup($ctrl[1]); 

                // setup page validation
                if (_.isFunction(page.pageValidation)){
                    $scope.$watch(function(){
                        $scope.pageForm.$setValidity('pageValidation', page.pageValidation(page, $scope.current));
                    });
                }
            }
        };
    }

    return directive;
});
