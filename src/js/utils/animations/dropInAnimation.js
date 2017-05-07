define(function(){

    function animation($window, now){

        var topdx = 60;
        var duration = 300;
        var raf = $window.requestAnimationFrame;
        var rafCancel = $window.cancelAnimationFrame;

        return {
            enter: function(element, done){
                var el = element[0]; // raw element;
                var cancelId;
                var start = now();

                // setup
                element.css({
                    top: -topdx +'px'
                });

                // activate animation
                cancelId = raf(enter);

                return function(canceled){
                    if (canceled){
                        rafCancel(cancelId);
                        element.css({top: '0px'});
                    }
                };

                function enter(){
                    var deltaTime = now() - start;
                    var proportion = deltaTime/duration;

                    // if we're out of time, finish the animation
                    if (deltaTime > duration) {
                        el.style.top = 0;
                        rafCancel(cancelId);
                        done();
                        return;
                    }

                    el.style.top = (topdx * (proportion-1)) + 'px';
                    cancelId = raf(enter);
                }
            },

            leave: function(element, done){
                var el = element[0]; // raw element;
                var cancelId;
                var start = now();

                // activate animation
                cancelId = raf(leave);

                return function(canceled){
                    if (canceled){
                        rafCancel(cancelId);
                    }
                };

                function leave(){
                    var deltaTime = now() - start;
                    var proportion = 1-deltaTime/duration;

                    // if we're out of time, finish the animation
                    if (deltaTime > duration) {
                        rafCancel(cancelId);
                        done();
                        return;
                    }

                    el.style.top = (topdx * (proportion-1)) + 'px';
                    cancelId = raf(leave);
                }
            }

        };
    }

    // $inject doesn't seem to work??
    return ['$window', 'timerNow', animation];
});
