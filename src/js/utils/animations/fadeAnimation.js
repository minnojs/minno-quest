define(function(){

    function animation($window, now){

        var duration = 300;
        var raf = $window.requestAnimationFrame;
        var rafCancel = $window.cancelAnimationFrame;

        return {
            enter: function(element, done){
                var el = element[0]; // raw element;
                var cancelId;
                var start = now();

                // setup
                el.style.opacity = 0;

                // activate animation
                cancelId = raf(enter);

                return function(canceled){
                    if (canceled){
                        rafCancel(cancelId);
                        el.style.opacity = 1;
                    }
                };

                function enter(){
                    var deltaTime = now() - start;
                    var proportion = deltaTime/duration;

                    // if we're out of time, finish the animation
                    if (deltaTime > duration) {
                        el.style.opacity = 1;
                        rafCancel(cancelId);
                        done();
                        return;
                    }

                    el.style.opacity = proportion;
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
                        el.style.opacity = 0;
                    }
                };

                function leave(){
                    var deltaTime = now() - start;
                    var proportion = 1-deltaTime/duration;

                    // if we're out of time, finish the animation
                    if (deltaTime > duration) {
                        el.style.opacity = 0;
                        rafCancel(cancelId);
                        done();
                        return;
                    }

                    el.style.opacity = proportion;
                    cancelId = raf(leave);
                }
            }

        };
    }

    // $inject doesn't seem to work??
    return ['$window', 'timerNow', animation];
});
