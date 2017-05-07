/**
 * This is our $console object.
 * It is a bit weird as it is supposed to work in concert with the consoleProvider.
 *
 * it depends on `tags` {Array} and `force` {Boolean} to be set externaly.
 *
 * {
 * 		log: logFn
 * 		info: infoFn
 * 		shouldLog: fn that test whether as specific level should be logged
 * 		settings: settingsObj ==> to be set from piConsole
 * 		tags: ['tag1'] // to be compared to settings.tags ==> to be set from piConsole
 * 		force: false // ignore tags and level ==> to be set from piConsole
 * }
 */
define(function(require){

    var _ = require('underscore');
    var LOGFUNCTIONS = ['log', 'info', 'warn', 'error', 'debug'];
    var LEVELS = {none:9, error:1, warn:2, info:3, log:4, debug:4};

    consolePrototypeProvider.$inject = ['$log', '$rootScope'];
    function consolePrototypeProvider ($log, $rootScope) {
		/**
		 * Create the prototype for the instances of piConsole
		 */
        var consolePrototype = {};

		// add logging function
        _.each(LOGFUNCTIONS, function(level){
            consolePrototype[level] = createLog(level);
        });

		// default settings
        consolePrototype.settings = {};

		// the function that checks if this instance
        consolePrototype.shouldLog = shouldLog;

		// if we want the individual functions to be seperable sometime...
		//_.bindAll(consolePrototype);

        return consolePrototype;

		/**
		 * This function is a method of the consolePrototype.
		 * It accesses the global settings, and the definitions set by Console and returns whether we should log
		 *
		 * @param  {String} level 	The level of logging we are testing
		 * @return {Boolean}		Whether to log this or not
		 */
        function shouldLog(level){
            var targetLevel = this.settings.level || 'warn'; // levels set to show
            var targetTags = this.settings.tags || 'all'; // tags set to show
            var tags = this.tags;
            var force = this.force;

            if (force){
                return true;
            }

			// check if this level should *not* be logged
            if (!~_.indexOf(LOGFUNCTIONS, targetLevel)){
                this.settings.level = 'error';
                this.error('Unknow DEBUG level: "' + targetLevel + '". The valid levels are debug>info>warn>error>none');
                return false;
            }

            if (LEVELS[level] > LEVELS[targetLevel]){
                return false;
            }

			// check if these tags should be logged (fit targetTags)
            if (targetTags !== 'all' && !_.intersection(tags, _.isArray(targetTags) ? targetTags : [targetTags]).length){
                return false;
            }

			// if we were not regected, this should be logged
            return true;
        }

		/**
		 * Builds the log functions for consolePrototype
		 * @param  {String} level 	Level name
		 * @return {Function}       A logging function
		 */
        function createLog (level) {
            return function(){
                var settings = this.settings;
                var i, args = [];

                if (this.shouldLog(level)){
					// get arguments (so that we don't leak the arguments object)
                    for (i=0; i < arguments.length; i++){args[i] = arguments[i];}

					// do the actual logging
                    $log[level].apply(null, args);

                    if (settings.hideConsole){return;}

					// broadcast to the piConsole directive
                    $rootScope.$emit('console:log',{
                        time: new Date(),
                        type: level,
                        args: args,
                        tags: this.tags
                    });

                }
            };
        }
    }

    return consolePrototypeProvider;

});