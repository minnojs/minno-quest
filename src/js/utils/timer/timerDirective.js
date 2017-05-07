/**
 * The piTimer directive lies dormant on its parent element
 * When "start(options)" is called it starts a timer
 *
 * options:
 * direction: up/down (default)
 * show: display counter
 * remove: remove counter when timer ends
 * duration: how long...
 *
 */
define(function (require) {

    var _ = require('underscore');
    var angular = require('angular');

    timerController.$inject = ['$timeout','timerStopper'];
    function timerController($timeout, TimerStopper){
        var ctrl = this;
        var $scope = {}; // the local scope that we created (fake object for case we attempt to access scope before we set it...)
        ctrl.start = timerStart;
        ctrl.stop = timerStop;

        function timerStart(options){
            if (!_.isPlainObject(options)){
                throw new Error('Timer options must be an object');
            }

            $scope = ctrl.getScope(); // get the local scope that we created

            $scope.options = _.defaults(options, {
                direction : 'down',
                template : 'normal',
                show : true,
                removeOnEnd : true,
                duration : 0 // in seconds
            });

			// translate duratio to ms
            ctrl.stopper = new TimerStopper();
            ctrl.targetTime = $scope.options.duration * 1000;

            $scope.options.show && ctrl.show();

			// activate the timer
            tick();
        }

        function timerStop(){
            var options = $scope.options || {};
            $scope = ctrl.getScope(); // get the local scope that we created
            $timeout.cancel(ctrl.timeoutId);
            options.removeOnEnd && ctrl.remove();
        }

        function tick(){
			// update scope
            var INTERVAL = 100;
            var options = $scope.options;
            var now = ctrl.stopper.now();
            var timeLeft = ctrl.targetTime - now;


            if (now >= ctrl.targetTime){
                $scope.$emit('timer-end');
                options.removeOnEnd && ctrl.remove();
                return;
            }

			// time to show and parse
            var currentTime = options.direction === 'up' ? now : timeLeft;

			// update scope with times
            _.extend($scope, milisToTime(currentTime));
            ctrl.timeoutId = $timeout(tick, Math.min(INTERVAL,timeLeft));
            $scope.$emit('timer-tick');
        }

        function milisToTime(time){
            var secs = Math.floor(time/1000);
            var hours = Math.floor(secs / (60 * 60));

            var divisor_for_minutes = secs % (60 * 60);
            var minutes = Math.floor(divisor_for_minutes / 60);

            var divisor_for_seconds = divisor_for_minutes % 60;
            var seconds = Math.ceil(divisor_for_seconds);

            var obj = {
                current: time,
                hours: hours,
                minutes: minutes,
                seconds: seconds,
                milis: time % 1000
            };
            return obj;
        }
    }

    timerDirective.$inject = ['$compile'];
    function timerDirective($compile){
        return {
            controller: timerController,
            priority: 400,
            link: function($scope, $element,$attr,ctrl){
                var template = '<div class="pi-timer well well-sm text-center" style="font-family: monospace;">{{minutes}}:{{zeroPad(seconds)}}</div>';
                var $timerElement;
                var localScope = $scope.$new();

                ctrl.show = show;
                ctrl.remove = remove;
                ctrl.getScope = function(){return localScope;};

                localScope.zeroPad = function pad(n){return n<10 ? '0'+n : n;};
                $scope.$on('$destroy',remove);

                function show(){
                    $timerElement = angular.element(template);
                    $element.prepend($timerElement);
                    $compile($timerElement.contents())(localScope);
                }

                function remove(){
                    $timerElement && $timerElement.remove();
                    $timerElement = null;
                }
            }
        };
    }

    return timerDirective;
});