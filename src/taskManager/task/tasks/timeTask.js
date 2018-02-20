import time from 'minno-time';
export default activateTime;

activateTime.$inject = ['done', '$element', 'task', 'script', 'piConsole'];
function activateTime(done, $canvas, task, script, piConsole){
    var $el;
    var pipSink;

    // update script name
    task.name && (script.name = task.name);

    $canvas.append('<div pi-player></div>');
    $el = $canvas.contents();

    pipSink = time($el[0], script);
    pipSink.onEnd(done);
    pipSink.$messages.map(piConsole);

    return function destroyPIP(){
        $el.remove();
        pipSink.end();
    };
}

