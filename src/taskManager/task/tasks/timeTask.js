import time from 'minno-time';
import createLogs from './createLogs';
export default activateTime;

activateTime.$inject = ['done', '$element', 'task', 'script', 'piConsole','logger'];
function activateTime(done, $canvas, task, script, piConsole, logger){
    var $el;
    var timeSink;
    var log = createLogs(logger, script, task);

    // update script name
    script.name = task.$name;

    $canvas.append('<div pi-player></div>');
    $el = $canvas.contents();

    timeSink = time($el[0], script);
    timeSink.promise.then(done);

    timeSink.$messages.map(piConsole);
    timeSink.$logs.map(log);
    timeSink.$logs.end.map(log.end);

    return function destroy(){
        log.end(true);
        $el.remove();
        timeSink.end();
        return timeSink.promise;
    };
}
