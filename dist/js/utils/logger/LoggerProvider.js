/*
 *	The logger Object
 *	Logger(settings)
 *	@param settings: the settings for this logger (defaults to the settings defined on loggerProvider.settings)
 *	settings = {
 *		pulse: 34, // after how many objects should we post
 *		url: '/my/url', // where should we post to
 *		meta: an object that extends each log
 *		DEBUG: false // activate logging each object to the console
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

	loggerProvider.$inject = ['$http','$q', '$log'];
	function loggerProvider($http, $q, $log){
		var self = this;

		function Logger(dfltLogFn){
			this.pending = [];
			this.sent = [];
			this.settings = {};
			this.meta = {};
			this.dfltLogFn = dfltLogFn || function(){return arguments[0];};
		}

		_.extend(Logger.prototype, {
			log: function(){
				var settings = this.settings;
				var logObj = (settings.logFn || this.dfltLogFn).apply(settings, arguments);

				if (!_.isEmpty(this.meta) && !_.isPlainObject(logObj)){
					settings.DEBUG && $log.log(logObj);
					throw new Error('Logger: in order to use "meta" the log must be an object.');
				}

				_.extend(logObj, this.meta);

				// if debug, then log this object
				settings.DEBUG && $log.log(logObj);

				this.pending.push(logObj);
				self.logCounter++;
				if (settings.pulse && this.pending.length >= settings.pulse){
					this.send();
				}
			},

			send: function(){
				var i;
				var settings = this.settings;
				var sendData = this.pending;
				var def = $q.defer();

				// if there are no records to send...
				if (sendData.length === 0){
					return def.resolve();
				}

				if (_.isUndefined(settings.url)){
					throw new Error('The logger url is not set.');
				}

				// empty the pending stack
				this.pending = [];

				$http.post(settings.url, sendData).then(success, error);

				// move everything pending to the sent stack
				for (i = 0; i<sendData.length; i++){
					this.sent.push(sendData[i]);
				}

				function success(){
					def.resolve();
				}

				function error(){
					// try again
					$http.post(settings.url, sendData).then(success, function(){
						throw new Error('Failed to send data, it seems the backend is not responding');
					});
				}
			},

			getCount: function(){
				return self.logCounter;
			},

			setSettings: function(settings){
				if (arguments.length === 0){
					return this.settings;
				}

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