/* jshint esnext:true */
define(function(require){

	var messages = require('./messages');
	var pipParser = require('./parser').pipElements;

	function pipValidator(script, url){
		var errors = [];
		var elements = pipParser(script);

		errors.push({type:'Settings', errors: checkSettings(script, url)});
		errors.push({type:'Trials', errors: elements.trials.map(trialTest)});

		return errors;
	}

	/**
	 * Check settings
	 * @param  {Object} script The script to be tested
	 * @param  {String} url    The script origin URL
	 * @return {Array}        Array of error rows
	 */
	function checkSettings(script, url){
		var settings = script.settings || {};

		function row(prop, arr){
			var el = {};
			el[prop] = settings[prop];
			return prop in settings && messages.row(el, arr);
		}

		// wrap warn/error so that I don't have to individually
		function byProp(fn){
			return function(msg, test){
				return fn(msg, e => {
					for (var prop in e) {
						return test(e[prop]);
					}
				});
			};
		}
		var warn = byProp(messages.warn);
		// var error = byProp(messages.error);

		var errors = [
			row('base_url', [
				warn('Your base_url is not in the same directory as your script.', e => {
					var path = url.substring(0, url.lastIndexOf('/') + 1);
					var t = s => (!s || s.indexOf(path) !== 0);
					return (typeof e == 'object') ? t(e.image) && t(e.template) : t(e);
				})
			])
		];

		return errors.filter(function(err){return !!err;});
	}

	function trialTest(trial) {
		var row = messages.row;
		var warn = messages.warn;
		var error = messages.error;
		var tests = [
			testInteractions(trial.interactions)
		];

		return row(trial, tests);

		function testInteractions(interactions){
			if (!interactions) {return;}

			if (!Array.isArray(interactions)){
				return [error('Interactions must be an array.', e=>e)];
			}

			return [
				error('All interactions must have conditions', interactions.some(i=>!i.conditions)),
				error('All interactions must have actions', interactions.some(i=>!i.actions))
			];



		}
	}

	return pipValidator;

});