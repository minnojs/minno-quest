define(function(require){
	var _ = require('underscore');

	consoleProvider.$inject = ['$log', '$rootScope', 'piConsoleSettings'];
	function consoleProvider($log, $rootScope, consoleSettings){
		var logFunctions = ['log', 'info', 'warn', 'error', 'debug'];
		var noopConsole = {active:false};
		var realConsole = {active:true};

		// create console prototypes
		_.each(logFunctions, function(logType){
			noopConsole[logType] = _.noop;
			realConsole[logType] = createLog(logType);
		});

		return $console;

		function $console(localTags){
			var shouldLog = consoleSettings.tags === true ||	// if settings is true
			 	consoleSettings.tags === 'all' || // if settings is all
			 	_.intersection(localTags || [], consoleSettings.tags).length; // is settings includes tag

			// create console object
			var $consoleObj = _.create(shouldLog ? realConsole : noopConsole);

			// keep track of relevant tags
			$consoleObj.tags = localTags;

			return $consoleObj;
		}

		function createLog (logType) {
			return function logProvider(){
				var i, args = [];

				for (i=0; i < arguments.length; i++){args[i] = arguments[i];}
				$log[logType].apply(null, args);

				$rootScope.$emit('console:log',args, this.tags);
			};
		}
	}

	return consoleProvider;
});