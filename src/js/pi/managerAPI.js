define(function(require){

	var Constructor = require('taskManager/API');
	var _ = require('underscore');
	var isDev = /^(localhost|127.0.0.1)/.test(location.host);
	var messageTemplate = require('text!pi/messageTemplate.html');

	/**
	 * Constructor for PIPlayer script creator
	 * @return {Object}		Script creator
	 */
	function API(){
		Constructor.call(this);
		this.settings.onPreTask = onPreTask;
	}

	// create API functions
	_.extend(API.prototype, Constructor.prototype);

	// annotate onPreTask
	onPreTask.$inject = ['currentTask', '$http','$rootScope'];

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
	function onPreTask(currentTask, $http, $rootScope){
		var global = $rootScope.global;
		var settings;
		var data = {taskName: currentTask.name || 'namelessTask', taskNumber: currentTask.$meta.number};

		// add logging meta
		if (currentTask.type == 'quest' || currentTask.type == 'pip'){
			settings = currentTask.$script.settings;
			settings.logger = settings.logger || {};
			settings.logger.meta = angular.extend(settings.logger.meta || {}, data);
		}

		if (currentTask.type == 'message' && currentTask.piTemplate){
			currentTask.$template = _.template(messageTemplate,{
				content: currentTask.$template,
				global: global,
				current: global.current,
				task: currentTask
			});
		}

		// set last task flag
		if (currentTask.last){
			data.sessionStatus = "C";
		}

		return isDev ? true : $http.post('/implicit/PiManager', data);
	}
});