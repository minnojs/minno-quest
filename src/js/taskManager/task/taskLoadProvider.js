/**
 * @name: taskLoadProvider
 * @returns {$q} A $q.promise that returns the target script
 */
define(function(){

	taskLoadProvider.$inject = ['$q', 'taskGetScript'];
	function taskLoadProvider($q, getScript){

		function taskLoad(task){
			var promise;

			// if we don't need any loading
			if (task.script){
				promise = task.script;
			} else {
				if (!task.scriptUrl){
					throw new Error('Tasks must have either a "script" property or a "scriptUrl" property.');
				}
				// load script
				promise = getScript(task.scriptUrl);
			}

			return $q.when(promise).then(function(script){
				task.$script = script;
				return script;
			});
		}

		return taskLoad;
	}

	return taskLoadProvider;
});