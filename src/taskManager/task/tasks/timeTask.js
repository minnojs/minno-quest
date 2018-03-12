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
    pipSink.onEnd(done);

    pipSink.$messages.map(piConsole);
    pipSink.$logs.map(log);
    pipSink.$logs.end.map(log.end);

    return function destroyPIP(){
        log.end(true);
        $el.remove();
        pipSink.end();
    };
}
