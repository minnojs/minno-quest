define(['underscore', 'angular'], function(_, angular){

	TaskProvider.$inject = ['$q','Database','Logger','QuestSequence','taskParse', 'dfltQuestLogger', '$rootScope'];
	function TaskProvider($q, Database, Logger, Sequence, parse, dfltQuestLogger,$rootScope){
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
					// check if there are unlogged questions and log them
					_.each($rootScope.current.questions, function(quest){
						if(quest.$logged){
							return true;
						}
						self.log(quest, {}, $rootScope.global);
						quest.$logged = true;
					});
					return self.logger.send();
				})
				.then(settings.onEnd || angular.noop);

			parse(script, this.db);
		}

		_.extend(Task.prototype, {
			log: function(){
				this.logger.log.apply(this.logger, arguments);
			},
			current: function(){
				var nextObj = this.sequence.current();

				if (!nextObj){
					this.q.resolve();
				}

				return nextObj;
			},
			next: function(){
				return this.sequence.next();
			},
			prev: function(){
				return this.sequence.prev();
			}
		});

		return Task;
	}

	return TaskProvider;
});