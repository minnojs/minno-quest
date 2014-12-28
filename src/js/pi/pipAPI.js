define(function(require){

	var Constructor = require('pip/API');
	var _ = require('underscore');
	var isDev = /^(localhost|127.0.0.1)/.test(location.host);

	/**
	 * Constructor for PIPlayer script creator
	 * @return {Object}		Script creator
	 */
	function API(name){
		Constructor.call(this, name);

		var settings = this.settings;
		var script = this.script;

		settings.logger = {
			pulse: 20,
			url : '/implicit/PiPlayerApplet'
		};

		// the activation function
		script.play = play;

		// the url builder for play
		script.buildBaseUrl = buildBaseUrl;

		isDev && (script.version = 'DEV!');
	}

	// create API functions
	_.extend(API.prototype, Constructor.prototype);
	API.prototype.setVersion = function setVersion(ver){this.script.version = ver;};

	// annotate the play function
	play.$inject = ['done', '$element', 'script', 'task'];

	return API;

	/**
	 * The activator function for pip
	 * (anotated up in the main code)
	 */
	function play(done, $canvas, script, task){
		var $el, req, baseUrl ,version = task.version || this.version;

		if (task.type !== 'pip'){
			throw new Error('Expected task.type to be "pip" but found: "' + task.type + '".');
		}

		if (!version){
			throw new Error('Version not defined for pip task: ' + (task.name || script.name));
		}

		baseUrl = this.buildBaseUrl(version);

		// load PIP
		req = requirejs.config({
			context: _.uniqueId(),
			baseUrl: baseUrl+'/dist/js/', // can't use packages yet as urls in pip aren't relative...
			paths: {
				//plugins
				text: ['//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.3/text.min', baseUrl+"/bower_components/requirejs-text/text"],

				// Core Libraries
				jquery: ["//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min",baseUrl+"/bower_components/jquery/dist/jquery.min"],
				underscore: ["//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min",baseUrl+"/bower_components/lodash/dist/lodash.min"],
				backbone: ['//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min', baseUrl+"/bower_components/backbone/backbone"]
			},

			deps: ['jquery', 'backbone', 'underscore']
		});

		// update script name
		task.name && (script.name = task.name);

		$canvas.append('<div pi-player></div>');
		$el = $canvas.contents();
		$el.addClass('pi-spinner');

		req(['activatePIP'], function(activate){
			$el.removeClass('pi-spinner');
			activate(script, done);
		});
	}

	/**
	 * Build BaseUrl from version
	 * @param  {string} version pip version
	 * @return {string}         baseUrl
	 */
	function buildBaseUrl(version){
		return isDev ? '/pip/' : '/implicit/common/all/js/pip/'+version;
	}

});