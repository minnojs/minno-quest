define(function(require){
	var _ = require('underscore');

	managerProvider.$inject = ['$rootScope', '$q', 'managerSequence', 'taskLoad'];
	function managerProvider($rootScope, $q, managerSequence, taskLoad){

		/**
		 * This is the constructor for the manager object.
		 *
		 * The manager is responsible for the interface between the managerDirective and the managerSequence
		 * It deals with loading tasks (pulled from the sequence)
		 * And notifying the directive that a new task is ready to be run.
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
			this.sequence = managerSequence(script);

			$scope.$on('manager:next', function(){self.next.call();});
			$scope.$on('manager:prev', function(){self.prev.call();});
		}

		_.extend(manager.prototype, {
			next: function(){
				var task = this.sequence.next();
				this.load(task);
			},

			prev: function(){
				var task = this.sequence.prev();
				this.load(task);
			},

			current: function(){
				var task = this.sequence.current() || {};
				// taskLoad sets the loaded script into $script
				return task.$script;
			},

			load: function(task){
				var $scope = this.$scope;
				taskLoad(task).then(function(){
					$scope.$emit('manager:loaded');
				});
			}
		});

		return manager;
	}

	return managerProvider;

});


