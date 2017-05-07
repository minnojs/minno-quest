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
                el.style.left = '-100%';

                // activate animation
                cancelId = raf(enter);

                return function(canceled){
                    if (canceled){
                        rafCancel(cancelId);
                        el.style.left = '0%';
                    }
                };

                function enter(){
                    var deltaTime = now() - start;
                    var proportion = 1 - deltaTime/duration;

                    // if we're out of time, finish the animation
                    if (deltaTime > duration) {
                        el.style.left = '0%';
                        rafCancel(cancelId);
                        done();
                        return;
                    }

                    el.style.left = (-proportion*100) + '%';

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
                        el.style.left = '100%';
                    }
                };

                function leave(){
                    var deltaTime = now() - start;
                    var proportion = deltaTime/duration;

                    // if we're out of time, finish the animation
                    if (deltaTime > duration) {
                        el.style.left = '100%';
                        rafCancel(cancelId);
                        done();
                        return;
                    }

                    el.style.left = (proportion*100) + '%';
                    cancelId = raf(leave);
                }
            }

        };
    }

    // $inject doesn't seem to work??
    return ['$window', 'timerNow', animation];
});
