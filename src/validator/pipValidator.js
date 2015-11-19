/* jshint esnext:true */
define(function(require){

	var messages = require('./messages');
	var pipParser = require('./parser').pipElements;
	var row = messages.row;
	var warn = messages.warn;
	var error = messages.error;

	return pipValidator;

	function pipValidator(script, url){
		var errors = [];
		var elements = pipParser(script);

		errors.push({type:'Settings',errors: checkSettings(script, url)});
		errors.push({type:'Trials',errors: filterMap(elements.trials, trialTest)});
		// errors.push({type:'Stimuli',errors: filterMap(elements.stimuli, stimuliTest)});
		// errors.push({type:'Media',errors: filterMap(elements.media, mediaTest)});

		return errors;
	}

	function filterMap(arr, fn){
		return arr.map(fn).filter(e=>e);
	}

	function toArray(obj){
		return Array.isArray(obj) ? obj : [obj];
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
		var tests = [
			testInteractions(trial.interactions),
			testInput(trial.input)
		];

		return row(trial, tests);

		function testInteractions(interactions){
			if (!interactions) {return;}

			if (!Array.isArray(interactions)){
				return [error('Interactions must be an array.', true)];
			}

			return [
				interactions.some(i=>!i.conditions) ? error('All interactions must have conditions', true) : [
					error('All conditions must have a type', interactions.some(i=>!!i.conditions.type))
				],
				interactions.some(i=>!i.actions) ? error('All interactions must have actions', true) : [
					error('All actions must have a type', interactions.some(i=>!!i.actions.type))
				],
			];
		}

		function testInput(input){
			if (!input) {return;}

			if (!Array.isArray(trial.input)){
				return [error('Input must be an Array', true)];
			}

			return [
				error('Input must always have a handle', input.some(i=>!i.handle)),
				error('Input must always have an on attribute', input.some(i=>!i.on)),
			];
		}
	}

	function stimuliTest(stim){
		var tests = [];
		return row(stim, tests);
	}

	function mediaTest(media){
		var tests = [

		];
		return row(media, tests);
	}



});