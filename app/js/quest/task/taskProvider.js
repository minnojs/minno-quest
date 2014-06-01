define(['underscore', 'angular'], function(_, angular){

	TaskProvider.$inject = ['$q','Database','Logger','TaskSequence','taskParse'];
	function TaskProvider($q, Database, Logger, Sequence, parse){
		function Task(script){
			// save script for later use...
			this.script = script;
			var settings = script.settings || {};

			this.q = $q.defer();
			this.q.promise.then(settings.onEnd || angular.noop);

			this.db = new Database();
			this.logger = new Logger(settings.logger || {});
			this.sequence = new Sequence([], this.db);

			parse(script, this.db, this.sequence);
		}

		_.extend(Task.prototype, {
			log: function(){
				this.logger.log.apply(this.logger, arguments);
			},
			next: function(target){
				var nextObj = this.sequence.proceed(target, this.db);

				if (!nextObj){
					this.q.resolve();
				}

				return nextObj;
			}

		});

		return Task;
	}

	return TaskProvider;
});