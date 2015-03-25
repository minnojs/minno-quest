define(function(require){
	var _ = require('underscore');

	sequenceProvider.$inject = ['Database'];
	function sequenceProvider(Database){

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
			db.add('tasks', script.tasksSets || []);

			// setup sequence
			this.sequence = db.sequence('tasks', script.sequence);
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