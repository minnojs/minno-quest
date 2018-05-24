/*
 *	The logger Object
 *	Logger(settings)
 *	@param settings: the settings for this logger (defaults to the settings defined on loggerProvider.settings)
 *	settings = {
 *		pulse: 34, // after how many objects should we post
 *		url: '/my/url', // where should we post to
 *		meta: an object that extends each log
  *	}
 *
 *	methods:
 *
 *	log(obj) - add an object to the log stack
 *	@param obj: any object that we want to log (as long as it is defined)
 *
 *	send() - send any remaining objects to the server
 *
  */
define(function(require){
    var _ = require('underscore');

    loggerProvider.$inject = ['$http','$q', 'piConsole','$rootScope'];
    function loggerProvider($http, $q, piConsole,$rootScope){
        var self = this;
        var global = $rootScope.global;
        var logs = [];
        _.set(global, 'current.logs', logs);

        function Logger(dfltLogFn){
            this.pending = [];
            this.sent = [];
            this.settings = {};
            this.meta = {};
            this.suppress = false; // don't suppress send
            this.dfltLogFn = dfltLogFn || function(a){return a;};
        }

        _.extend(Logger.prototype, {
            log: function(){
                var settings = this.settings;
                var logObj = (settings.logFn || this.dfltLogFn).apply(settings, arguments);

                if (!_.isEmpty(this.meta) && !_.isPlainObject(logObj)){
                    piConsole(['logger']).debug(logObj);
                    throw new Error('Logger: in order to use "meta" the log must be an object.');
                }
                _.extend(logObj, this.meta);
                
                logs.push(logObj);

				// if debug, then log this object
                piConsole(['logger']).debug('Logged: ', logObj);

                this.pending.push(logObj);
                self.logCounter++;
                if (settings.pulse && !this.suppress && this.pending.length >= settings.pulse) this.send();
            },

            send: function(){
                var i;
                var settings = this.settings;
                var sendData = this.pending;
                var def = $q.defer();

				// if there are no records to send...
                if (sendData.length === 0){
                    def.resolve();
                    return def.promise;
                }

                // is undefined or null
                if (settings.url == null){
                    def.resolve();
                    return def.promise;
                }

				// empty the pending stack
                this.pending = [];

                $http.post(settings.url, sendData).then(success, error);

				// move everything pending to the sent stack
                for (i = 0; i<sendData.length; i++){
                    this.sent.push(sendData[i]);
                }

                return def.promise;

                function success(){
                    return def.resolve();
                }

                function error(){
					// try again
                    return $http.post(settings.url, sendData).then(success, function(e){
                        piConsole(['logger']).error('Failed to send data, it seems the backend is not responding. (sending to: "' + settings.url +'")');

                        try { var promise = _.isFunction(settings.error) && settings.error(e); } 
                        catch(err){ return def.reject(err); }

                        if (promise && _.isFunction(promise.then)) return promise.then(def.resolve, def.reject);
                        return def.reject(e);
                    });
                }
            },

			/**
			 * suppress pulse
			 * sets suppress to `suppress`, or to true by default.
			 */
            suppressPulse: function (suppress) {
                this.suppress = _.isUndefined(suppress) ? true : suppress;
            },

            getCount: function(){
                return self.logCounter;
            },

            setSettings: function(settings){
                if (arguments.length === 0) return this.settings;

				// inherit settings both from settings obj, and the global settings
                this.settings = _.defaults({}, settings, self.settings);

                if (!_.isUndefined(settings.meta) && !_.isPlainObject(settings.meta)){
                    throw new Error('Logger: "meta" must be an object.');
                }

				// inherit meta settings
                this.meta = _.defaults({}, settings.meta, self.meta);
            }
        });

        return Logger;
    }

    return function(){
        this.$get = loggerProvider;
        this.settings = {};
        this.meta = {};
        this.logCounter = 0;
    };
});
