define(function(require){
	var _ = require('underscore');

	sequenceProvider.$inject = ['TaskSequence','Database'];
	function sequenceProvider(TaskSequence, Database){

		/**
		 * The sequence for the manager (essentialy the model).
		 * @param  {Object} script A manager script.
		 * @return {Object}
		 */
		function sequence(script){
			var db;
			// make sure this works without a new statement
			if (!(this instanceof sequence)){
				// jshint newcap:false
				return new sequence(script);
				// jshint newcap:true
			}

			// setup database
			db = this.db = new Database();
			db.createColl('tasks');
			db.add('tasks', script.tasks || []);

			// setup sequence
			this.sequence = new TaskSequence('tasks', script.sequence, db);
		}

		_.extend(sequence.prototype, {
			next: function(){
				this.sequence.next();
				return this;
			},

			prev: function(){
				this.sequence.prev();
				return this;
			},

			current: function(){
				return this.sequence.current();
			}
		});

		return sequence;
	}

	return sequenceProvider;
});