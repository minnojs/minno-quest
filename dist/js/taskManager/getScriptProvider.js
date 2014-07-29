define(['require'],function(require){

	getScriptProvider.$inject = ['$q'];
	function getScriptProvider($q){

		function getScript(url){
			var def = $q.defer();

			require([url], function(script){
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