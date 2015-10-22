define(function(require){

	var Constructor = require('../managerAPI');
	var _ = require('underscore');
	var isDev = /^(localhost|127.0.0.1)/.test(location.host) || window.DEBUG;
	var decorator = require('APIs/pi/APIdecorator');

	var messageTemplate = require('text!./messageTemplate.jst');
	var messageTemplateDebrief = require('text!./messageTemplateDebrief.jst');
	var messageTemplatePanel = require('text!./messageTemplatePanel.jst');

	/**
	 * Constructor for PIPlayer script creator
	 * @return {Object}		Script creator
	 */
	function API(){
		Constructor.call(this);
		this.settings.onPreTask = onPreTask;
	}

	decorator(API);

	// create API functions
	_.extend(API.prototype, Constructor.prototype);

	// annotate onPreTask
	onPreTask.$inject = ['currentTask', '$http','$rootScope','managerBeforeUnload','templateDefaultContext'];

	return API;

	/**
	 * Before each task,
	 * 		post to /implicit/PiManager
	 * 		in case this is a quest/pip added logging meta
	 *
	 * @param  {Object} currentTask The task Object
	 * @param  {Object} $http       The $http service
	 * @return {Promise}            Resolved when server responds
	 */
	function onPreTask(currentTask, $http, $rootScope, beforeUnload, templateDefaultContext){

		var global = $rootScope.global;
		var settings, context;
		var data = {taskName: currentTask.name || 'namelessTask', taskNumber: currentTask.$meta.number};

		// add logging meta
		if (currentTask.type == 'quest' || currentTask.type == 'pip'){
			currentTask.$script.serial = currentTask.$meta.number;
			settings = currentTask.$script.settings;
			settings.logger = settings.logger || {};
			settings.logger.meta = angular.extend(settings.logger.meta || {}, data);
		}

		// add feedback

		_.extend(templateDefaultContext,{
			showFeedback: _.bind(showFeedback,null,global),
			showPanel: showPanel
		});

		if (currentTask.type == 'message' && currentTask.piTemplate){
			context = {
				content: currentTask.$template,
				global: global,
				current: global.current,
				task: currentTask
			};

			if (currentTask.piTemplate == 'debrief'){
				currentTask.$template = _.template(messageTemplateDebrief)(context); // insert into meta template
				currentTask.$template = _.template(currentTask.$template)(context); // render secondary template with extended context
			} else {
				currentTask.$template = _.template(messageTemplate)(context); // insert into meta template
			}
		}

		// set last task flag
		if (currentTask.last){
			data.sessionStatus = "C";
			beforeUnload.deactivate();
		}

		if (currentTask.last && global.$mTurk){
			var $mTurk = global.$mTurk;
			var url = $mTurk.isProduction ?  'http://www.mturk.com/mturk/externalSubmit' : 'https://workersandbox.mturk.com/mturk/externalSubmit';
			var onPost = currentTask.post || _.noop;


			if (!_.every(['assignmentId','hitId','workerId'], function(prop){return _.has($mTurk, prop);})){
				throw new Error ('$mTurk is missing a crucial property (assignmentId,hitId,workerId)');
			}

			currentTask.post = function(){
				onPost.apply(this, arguments);
				postRedirect(url,_.omit($mTurk,'isProduction'));
			};
		}

		if (window._err && window._err.meta){
			var meta = window._err.meta;
			meta.subtaskName = currentTask.name;
			meta.subtaskURL = currentTask.scriptUrl || currentTask.templateUrl;
		}

		return isDev ? true : $http.post('/implicit/PiManager', data);
	}

	function postRedirect(path, params, method) {
	    method = method || "post"; // Set method to post by default if not specified.

	    // The rest of this code assumes you are not using a library.
	    // It can be made less wordy if you use one.
	    var form = document.createElement("form");
	    form.setAttribute("method", method);
	    form.setAttribute("action", path);

	    for(var key in params) {
	        if(params.hasOwnProperty(key)) {
	            var hiddenField = document.createElement("input");
	            hiddenField.setAttribute("type", "hidden");
	            hiddenField.setAttribute("name", key);
	            hiddenField.setAttribute("value", params[key]);

	            form.appendChild(hiddenField);
	         }
	    }

	    document.body.appendChild(form);
	    form.submit();
	}

	function showPanel(content, header, footer){
		return _.template(messageTemplatePanel, {
			content: content,
			header: header,
			footer: footer
		});
	}

	function showFeedback(global, options){
		_.isPlainObject(options) || (options = {});

		_.defaults(options,{
			pre: '<p>',
			post: '</p>',
			wrap: true,
			header: '',
			noFeedback: '<p>No feedback was found</p>',
			property: 'feedback',
			exclude: []
		});

		var feedback = _(global)
			.filter(function(task,taskName){
				if (!_.isArray(options.exclude)) { throw Error('Exclude must be an array'); }
				// make sure task is an object
				// make sure feedback is defined
				// make sure this task is not excluded
				return _.isPlainObject(task) && !_.isUndefined(task[options.property]) && (_.indexOf(options.exclude,taskName) === -1);
			})
			.mapValues(function(task){
				return options.pre + task[options.property] + options.post;
			})
			.reduce(function(result, feedback){
				return result + feedback;
			},'') || options.noFeedback;

		return options.wrap ? showPanel(feedback, options.header) : feedback;
	}
});

