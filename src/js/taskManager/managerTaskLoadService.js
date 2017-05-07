/**
 * @name: taskLoadProvider
 * @returns {$q} A $q.promise that returns the target script
 */
define(function(require){
    var _ = require('underscore');

    taskLoadService.$inject = ['$q', 'managerGetScript', 'piConsole'];
    function taskLoadService($q, managerGetScript, $console){

        function getScript(url, options){
            return managerGetScript(url, options)
				// make sure that the script is defined
				// and if not throw an appropriate error
				.then(function(script){
    var e;
    if (_.isUndefined(script)){
        e = new Error('Task ' + url + ' failed or has not been found. Make sure that you returned the script and that your script does not have any errors');
        $console('task').error(e);
        throw e;
    }

    return script;
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
                $console('load').error('Failed to load task script - make sure that your URLs are all correct and that your script does not have any errors.', e);
            });

            return promise;
        }

        return taskLoad;
    }

    return taskLoadService;
});