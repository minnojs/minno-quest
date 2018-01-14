/**
 * @name: taskLoadProvider
 * @returns {$q} A $q.promise that returns the target script
 */

import _ from 'lodash';

taskLoadService.$inject = ['$q', 'managerGetScript', 'piConsole'];
function taskLoadService($q, managerGetScript, $console){

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
                    message: 'Make sure that you returned the script and that your script does not have any errors',
                    error:e
                });
                throw e;
            });
    }

    function taskLoad(task, options){
        var promise, script, template;

        // script def
        if (task.scriptUrl){
            script = getScript(task.scriptUrl, options);
        } else {
            script = task.script;
        }

        // template def
        if (task.templateUrl){
            template = getScript(task.templateUrl, _.extend({isText:true},options));
        } else {
            template = task.template;
        }

        promise = $q.all({script: $q.when(script), template: $q.when(template)});

        promise.then(function(promises){
            task.$script = promises.script;
            task.$template = promises.template;
            return task;
        }, function(e){
            $console({
                tags:'load',
                type:'error',
                message:'Failed to load task script - make sure that your URLs are all correct and that your script does not have any errors.',
                context:task
            });
            throw e;
        });

        return promise;
    }

    return taskLoad;
}

export default taskLoadService;
