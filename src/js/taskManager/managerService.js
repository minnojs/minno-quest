define(function(require){
	var _ = require('underscore');

	managerService.$inject = ['$rootScope', '$q', 'managerSequence', 'managerTaskLoad'];
	function managerService($rootScope, $q, ManagerSequence, taskLoad){

		/**
		 * This is the constructor for the manager object.
		 *
		 * The manager is responsible for the interface between the managerDirective and the managerSequence
		 * It deals with loading tasks (pulled from the sequence)
		 * And notifying the directive that a new task is ready to be run.
		 *
		 * listens to manager:next and manager:prev ==> proceeds sequence
		 *
		 * emits manager:loaded <== when a script is loaded
		 *
		 * @param  {Scope} $scope The scope to be notified
		 * @param  {Object} script The manager script to be parsed
		 * @return {Object}
		 */
		function manager($scope, script){
			var self = this;
			// make sure this works without a new statement
			if (!(this instanceof manager)){
				// jshint newcap:false
				return new manager($scope,script);
				// jshint newcap:true
			}

			this.$scope = $scope;
			this.script = script;

			// create sequence
			this.sequence = new ManagerSequence(script);

			$scope.$on('manager:next', function(){self.next();});
			$scope.$on('manager:prev', function(){self.prev();});
		}

		_.extend(manager.prototype, {
			next: function(){
				this.sequence.next();
				this.load();
			},

			prev: function(){
				this.sequence.prev();
				this.load();
			},

			current: function(){
				var task = this.sequence.current();
				// taskLoad sets the loaded script into $script
				return task;
			},

			load: function(){
				var task = this.current();
				var $scope = this.$scope;

				if (task){
					taskLoad(task, this.baseUrl).then(function(){
						$scope.$emit('manager:loaded');
					});
				} else {
					// let the directive deal with the end of the sequence
					$scope.$emit('manager:loaded');
				}
			},

			setBaseUrl: function(baseUrl){
				this.baseUrl = baseUrl;
			}
		});

		return manager;
	}

	return managerService;

});
