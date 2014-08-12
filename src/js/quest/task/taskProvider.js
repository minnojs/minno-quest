define(['underscore', 'angular'], function(_, angular){

	TaskProvider.$inject = ['$q','Database','Logger','QuestSequence','taskParse', 'dfltQuestLogger'];
	function TaskProvider($q, Database, Logger, Sequence, parse, dfltQuestLogger){
		function Task(script){
			var self = this;
			var settings = script.settings || {};

			// save script for later use...
			this.script = script;
			this.db = new Database();
			this.logger = new Logger(dfltQuestLogger);
			this.logger.setSettings(settings.logger || {});
			this.q = $q.defer();

			if (!_.isArray(script.sequence)){
				throw new Error('Task: no sequence was defined');
			}

			this.sequence = new Sequence(script.sequence, this.db);

			this.q.promise
				.then(function(){
					return self.logger.send();
				})
				.then(settings.onEnd || angular.noop);

			parse(script, this.db);
		}

		_.extend(Task.prototype, {
			log: function(){
				this.logger.log.apply(this.logger, arguments);
			},
			next: function(){
				var nextObj = this.sequence.next().current();

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