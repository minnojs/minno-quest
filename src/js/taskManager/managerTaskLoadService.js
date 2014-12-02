/**
 * @name: taskLoadProvider
 * @returns {$q} A $q.promise that returns the target script
 */
define(function(){

	taskLoadService.$inject = ['$q', 'managerGetScript'];
	function taskLoadService($q, getScript){

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
			});

			return promise;
		}

		return taskLoad;
	}

	return taskLoadService;
});