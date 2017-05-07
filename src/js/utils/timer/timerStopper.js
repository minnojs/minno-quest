/**
 * a stopper
 */

define(function(){

    stopperProvider.$inject = ['timerNow'];
    function stopperProvider(now){
        function Stopper(){
            this.startTime = now();
        }

        Stopper.prototype.now = function(){
            return now() - this.startTime;
        };

        return Stopper;
    }

    return stopperProvider;

});