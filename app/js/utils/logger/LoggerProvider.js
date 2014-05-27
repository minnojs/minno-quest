/*
 *	The logger Object
 *	Logger(settings)
 *	@param settings: the settings for this logger (defaults to the settings defined on loggerProvider.settings)
 *	settings = {
 *		pulse: 34, // after how many objects should we post
 *		url: '/my/url', // where should we post to
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

		function Logger(settings){
			this.pending = [];
			this.sent = [];

			// inherit settings both from settings obj, and the global settings
			this.settings = _.defaults({}, settings, self.settings);
		}

		_.extend(Logger.prototype, {
			log: function(obj){
				var settings = this.settings;

				if (_.isUndefined(obj)){
					throw new Error('You can\'t log an undefined object');
				}

				var logObj = settings.logFn ? settings.logFn.apply(settings, arguments) : obj;

				if (settings.DEBUG){
					$log.log(logObj);
				}

				this.pending.push(logObj);
				self.logCounter++;
				if (settings.pulse && this.pending.length >= settings.pulse){
					this.send();
				}
			},

			send: function(){
				//console.log(this.pending.length)
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
			}
		});

		return Logger;
	}

	return function(){
		this.$get = loggerProvider;
		this.settings = {};
		this.logCounter = 0;
	};
});