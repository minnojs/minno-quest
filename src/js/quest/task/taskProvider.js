define(['underscore', 'angular'], function(_, angular){

	TaskProvider.$inject = ['$q','Database','Logger','TaskSequence','taskParse', 'dfltQuestLogger'];
	function TaskProvider($q, Database, Logger, Sequence, parse, dfltQuestLogger){
		function Task(script){
			var self = this;
			var settings = script.settings || {};

			// save script for later use...
			this.script = script;
			this.db = new Database();
			this.logger = new Logger(dfltQuestLogger);
			this.logger.setSettings(settings.logger || {});
			this.sequence = new Sequence([], this.db);
			this.q = $q.defer();

			this.q.promise
				.then(function(){
					return self.logger.send();
				})
				.then(settings.onEnd || angular.noop);

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