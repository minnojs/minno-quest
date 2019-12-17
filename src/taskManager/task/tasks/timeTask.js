import time from 'minno-time';
import createLogs from './createLogs';
export default activateTime;

activateTime.$inject = ['done', '$element', 'task', 'script', 'piConsole','logger'];
function activateTime(done, $canvas, task, script, piConsole, logger){
    var $el;
    var pipSink;
    var log = createLogs(logger, script, task);

    // update script name
    script.name = task.$name;

    $canvas.append('<div pi-player></div>');
    $el = $canvas.contents();

    pipSink = time($el[0], script);
    window.a = pipSink;
    pipSink.promise.then(done);

    pipSink.$messages.map(piConsole);
    pipSink.$logs.map(log);
    pipSink.$logs.end.map(log.end);

    return function destroy(){
        log.end(true);
        $el.remove();
        pipSink.end();
        return pipSink.promise;
    };
}
