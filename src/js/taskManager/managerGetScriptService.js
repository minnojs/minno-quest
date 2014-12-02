define(function(require){

	getScriptProvider.$inject = ['$q'];
	function getScriptProvider($q){

		// @TODO: separate the parsing into a different module (make this a dependency)

		var base = getPath(getBaseUrl());

		function getScript(url, baseUrl, isText){
			var def = $q.defer(),
				target = "";

			baseUrl || (baseUrl =  "");

			// starts with / or has :
            if (/^\/|:/.test(url)){
            	// assume this is a full url
            	target = url;
            } else {
            	// add base and baseUrl
	            target += base + '/' + baseUrl +'/'+ url;
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

	function getPath(path){
		return path.substring(0, path.lastIndexOf('/'));
	}

	function getBaseUrl(){
		var baseTags;
		if ('BaseURI' in document) {
			return document.baseURI;
		}

		baseTags = document.getElementsByTagName('base');
		if (baseTags.length >0) {
			return baseTags[0].href;
		}

		return window.location.href;
	}

	return getScriptProvider;

});