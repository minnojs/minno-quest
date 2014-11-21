define(['require'],function(require){

	getScriptProvider.$inject = ['$q'];
	function getScriptProvider($q){

		function getScript(url, isText){
			var def = $q.defer();
			var prefix = isText ? 'text!' : '';

			require([prefix + url], function(script){
				def.resolve(script);
			}, function(err){
				def.reject(err);
			});

			return def.promise;
		}

		return getScript;
	}

	return getScriptProvider;

});