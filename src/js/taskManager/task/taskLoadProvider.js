/**
 * @name: taskLoadProvider
 * @returns {$q} A $q.promise that returns the target script
 */
define(function(){

	taskLoadProvider.$inject = ['$q', 'taskGetScript'];
	function taskLoadProvider($q, getScript){

		function taskLoad(task){
			var def;

			// if we don't need any loading
			if (task.script){
				def = $q.defer();
				def.resolve(task.script)
				return def.promise;
			}

			if (!task.scriptUrl){
				throw new Error('Tasks must have eithe a "script" property or a "scriptUrl" property.')
			}

			// load script
			return getScript(task.scriptUrl);
		}

		return taskLoad;
	}

	return taskLoadProvider;
});