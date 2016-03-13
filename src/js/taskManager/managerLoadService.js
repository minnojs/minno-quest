/**
 * @name: managerLoadService
 * @returns {$q} A $q.promise that returns the target script
 */
define(function(require){

	var _ = require('underscore');

	managerLoadService.$inject = ['$q', 'managerGetScript'];
	function managerLoadService($q, getScript){

		function managerLoadScript(source){
			var promise = _.isString(source) ? getScript(source,{bustCache:true}) : source;
			return $q.when(promise);
		}

		return managerLoadScript;
	}

	return managerLoadService;
});