/**
 * @name: taskLoadProvider
 * @returns {$q} A $q.promise that returns the target script
 */
define(function(require){
	var _ = require('underscore');

	taskLoadService.$inject = ['$q', 'managerGetScript', 'piConsole'];
	function taskLoadService($q, managerGetScript, $console){

		function getScript(url, baseUrl, isText){
			return managerGetScript(url, baseUrl, isText)
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

		function taskLoad(task, baseUrl){
			var promise, script, template;

			script = task.scriptUrl ? getScript(task.scriptUrl, baseUrl) : task.script;
			template = task.templateUrl ? getScript(task.templateUrl, baseUrl,true) : task.template;

			if (!script && !template){
				throw new Error('Tasks must have either a "script" property or a "scriptUrl" property (or a "template" property in specific cases).');
			}

			promise = $q.all({script: $q.when(script), template: $q.when(template)});

			promise.then(function(promises){
				task.$script = promises.script;
				task.$template = promises.template;
				return task;
			}, function(e){
				$console('load').error('Failed to load task script - make sure that your URLs are all correct.',e);
			});

			return promise;
		}

		return taskLoad;
	}

	return taskLoadService;
});