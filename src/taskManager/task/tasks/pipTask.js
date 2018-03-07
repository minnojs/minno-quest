import _ from 'lodash';
import liftSave from './liftSave';
import {requirejs} from 'requirejs/require.js';
export default activatePIP;

activatePIP.$inject = ['done', '$element', 'task', 'script', 'piConsole', 'logger'];
function activatePIP(done, $canvas, task, script, piConsole, logger){
    var log = logger.createLog(task.$name, script.settings.logger);
    var $el, req;
    var pipSink;

    script.name = task.$name;
    liftSave(log, script);

    if (task.version > 0.4) {
        $canvas.append('<div pi-player></div>');
        $el = $canvas.contents();
        requirejs([task.baseUrl + '/dist/time.js'], function(time){

            pipSink = time($el[0], script);
            pipSink.onEnd(done);
            pipSink.$messages.map(piConsole);

            pipSink.$logs.map(log);
            pipSink.$logs.end.map(log.end);
        }, function(e){
            piConsole({
                type:'error',
                message: 'Failed to load minno-time, please make sure that task.baseUrl is set correctly',
                error: e
            });
            throw e;
        });

        return function destroyPIP(){
            log.end(true);
            $el.remove();
            pipSink && pipSink.end();
        };
    }

    // load PIP
    req = requirejs.config({
        context: _.uniqueId(),
        baseUrl: task.baseUrl || '../bower_components/PIPlayer/dist/js', // can't use packages yet as urls in pip aren't relative...
        paths: {
            //plugins
            text: ['//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.3/text.min', '../../bower_components/require-text/text'],

            // Core Libraries
            jquery: ['//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min','../../bower_components/jquery/dist/jquery.min'],
            underscore: ['//cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min','../../bower_components/lodash-compat/lodash.min'],
            backbone: ['//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min', '../../bower_components/backbone/backbone']
        },

        deps: ['jquery', 'backbone', 'underscore']
    });

    // update script name
    task.name && (script.name = task.name);

    $canvas.append('<div pi-player></div>');
    $el = $canvas.contents();
    $el.addClass('pi-spinner');

    req(['activatePIP'], function(activate){
        $el.removeClass('pi-spinner');
        activate(script, done);
    });

    return function destroyPIP(){
        $el.remove();
        req(['app/task/main_view'], function(main){
            main.deferred.resolve();
            main.destroy();
        });
    };
}
