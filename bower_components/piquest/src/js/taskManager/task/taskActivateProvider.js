/**
 * @name: taskActivateProvider
 */
define(function(require){

	var _ = require('underscore');


	function provider(){
		var activators = {};

		this.$get = taskActivateProvider;

		this.set = function set(name, fn){
			activators[name] = fn;
		};

		this.get = function(name){
			return activators[name];
		};
	}


	taskActivateProvider.$inject = ['$q', '$rootScope', '$injector'];
	function taskActivateProvider($q,$rootScope, $injector){
		var self = this;

		function taskActivate(task, $element, $scope){
			var activator;
			var def = $q.defer();
			var global = $rootScope.global;
			var script = task.$script;

			// get activation function
			if (_.isFunction(script)){
				activator = script;
			}

			if (!activator && script && _.isFunction(script.play)){
				activator = _.bind(script.play, script);
				activator.$inject = $injector.annotate(script.play);
			}

			if (!activator && script && _.isArray(script.play)){
				activator = _.bind(script.play[script.play.length-1], script);
				activator.$inject = $injector.annotate(script.play);
			}


			if (!activator && task.type){
				activator = self.get(task.type);
			}

			if (!_.isFunction(activator)){
				throw new Error('Activator function not found for the "' + task.type + '" task');
			}

			// activate task
			/**
			 * activation function
			 * @param {function} done calback for finishing the task
			 * @param {obj} props an object with all the stuff we think we could need...
			 * @type {[type]}
			 */

			$injector.invoke(activator, null, {
				done: _.bind(def.resolve,def),
				task: task,
				script: script,
				$element: $element,
				$scope: $scope,
				global: global
			});

			return def.promise;
		}

		return taskActivate;
	}

	return provider;
});