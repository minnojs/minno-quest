define(function(require){



	var Constructor = require('taskManager/API');
	var _ = require('underscore');
	var isDev = /^(localhost|127.0.0.1)/.test(location.host);

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
	onPreTask.$inject = ['currentTask', '$http'];

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
	function onPreTask(currentTask, $http){
		var settings;
		var data = {taskName: currentTask.name || 'namelessTask', taskNumber: currentTask.$meta.number};

		// add logging meta
		if (currentTask.type == 'quest' || currentTask.type == 'pip'){
			settings = currentTask.$script.settings;
			settings.logger = settings.logger || {};
			settings.logger.meta = angular.extend(settings.logger.meta || {}, data);
		}

		return isDev ? true : $http.post('/implicit/PiManager', data);
	}

});