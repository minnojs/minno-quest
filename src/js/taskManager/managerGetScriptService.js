define(function(require){

    getScriptProvider.$inject = ['$q'];
    function getScriptProvider($q){

        // @TODO: separate the parsing into a different module (make this a dependency)
        function getScript(url, options){
            options || (options = {});
            var def = $q.defer(), target = '';

            // if url doesn't starts with / or has : then add baseUrl
            /^\/|:/.test(url) || (target += options.baseUrl ? options.baseUrl + '/' : '');

            target += url;

            options.isText && (target = 'text!' + target);
            options.bustCache && (target += '?bust=' + (new Date()).getTime());

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
