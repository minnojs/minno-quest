/**
 * @name: taskLoadProvider
 * @returns {$q} A $q.promise that returns the target script
 */

import _ from 'lodash';

taskLoadService.$inject = ['$q', 'managerGetScript', 'piConsole'];
function taskLoadService($q, managerGetScript, $console){
    return taskLoad;

    // WARNING: side effects. This function transforms the task object itself.
    function taskLoad(task, options){
        var script, template;

        // load sources
        script = task.scriptUrl ? getScript(task.scriptUrl, options) : task.script;
        template = task.templateUrl ? getScript(task.templateUrl, _.extend({isText:true},options)) : task.template;

        return  $q.all({
            script: $q.when(script), 
            template: $q.when(template)
        })
            .then(function(promises){
                task.$script = promises.script;
                task.$template = promises.template;
                return task;
            });
    }

    function getScript(url, options){
        return managerGetScript(url, options)
        // make sure that the script is defined
        // and if not throw an appropriate error
            .then(function(script){
                if (!_.isUndefined(script)) return script;
                var e = new Error('Could not load task ' + url);
                $console({
                    tags:'task',
                    type:'error',
                    context: url,
                    message: 'Make sure that you returned the script and that your script does not have any errors',
                    error:e
                });
                throw e;
            });
    }

}

export default taskLoadService;
