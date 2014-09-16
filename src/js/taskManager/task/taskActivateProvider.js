/**
 * @name: taskActivateProvider
 */
define(function(require){

	var _ = require('underscore');

	taskActivateProvider.$inject = ['$q', '$rootScope'];
	function taskActivateProvider($q,$rootScope){
		function taskActivate(task, script, $element){
			var activator;
			var def = $q.defer();
			var global = $rootScope.global;

			// get activation function
			if (_.isFunction(script)){
				activator = script;
			}

			if (_.isFunction(script.play)){
				activator = _.bind(script.play, script);
			}

			if (!_.isFunction(activator)){
				throw new Error('Activator function not found for the "' + task.type + '" task');
			}

			// activate task
			activator(_.bind(def.resolve,def), $element, global, task);

			return def.promise;
		}

		return taskActivate;
	}

	return taskActivateProvider;
});