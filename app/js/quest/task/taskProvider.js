define(['underscore'], function(_){

	TaskProvider.$inject = ['Database','Logger','TaskSequence','taskParse'];
	function TaskProvider(Database, Logger, Sequence, parse){
		function Task(script){
			// save script for later use...
			this.script = script;

			this.db = new Database();
			this.logger = new Logger();
			this.sequence = new Sequence([], this.db);

			parse(script, this.db, this.sequence);
		}

		_.extend(Task.prototype, {
			log: function(){
				this.logger.log.apply(this.logger, arguments);
			},
			next: function(target){
				return this.sequence.proceed(target, this.db);
			}

		});

		return Task;
	}

	return TaskProvider;
});