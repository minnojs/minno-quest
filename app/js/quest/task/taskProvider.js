define(['underscore'], function(_){

	TaskProvider.$inject = ['Database','Logger','Sequence','taskParse'];
	function TaskProvider(Database, Logger, Sequence, parse){
		function Task(script){
			// save script for later use...
			this.script = script;

			this.db = new Database();
			this.logger = new Logger();
			this.sequence = new Sequence();

			parse(script, this.db, this.sequence);
		}

		_.extend(Task.prototype, {
			log: function(obj){
				this.logger.log(obj);
			},
			next: function(options){
				this.sequence.next(options, this.db);
			}

		});

		return Task;
	}

	return TaskProvider;
});