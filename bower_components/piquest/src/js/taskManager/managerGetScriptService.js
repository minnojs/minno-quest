define(function(require){

	getScriptProvider.$inject = ['$q'];
	function getScriptProvider($q){

		// @TODO: separate the parsing into a different module (make this a dependency)
		function getScript(url, baseUrl, isText){
			var def = $q.defer(),
				target = "";

			// starts with / or has :
            if (/^\/|:/.test(url)){
            	// assume this is a full url
            	target = url;
            } else {
            	// add baseUrl

            	baseUrl = baseUrl ? baseUrl + '/' : "";

	            target += baseUrl + url;
            }

            isText && (target = 'text!' + target);

			require([target], function(script){
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