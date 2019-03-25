import _ from 'lodash';
import {require} from 'requirejs/require.js';
export default getScriptProvider;

function getScriptProvider(){
    var getText = _.memoize(getXhr);

    function getScript(url, options){
        if (!options) options = {};
        var target = buildUrl(url, options);
        return options.isText ? getText(target) : getRequire(target);
    }

    function buildUrl(url, options){
        var target = '';

        if (options.baseUrl && !/^\/|:/.test(url)) target += options.baseUrl + '/'; // if url doesn't start with / or has : 
        target += url;
        if (options.bustCache) target += '?bust=' + +new Date();
        
        return target;
    }

    function getRequire(url){
        return new Promise(function(resolve, reject){
            require([url], resolve, reject);
        });
    }

    function getXhr(url){
        return new Promise(function(resolve, reject){
            var request = new XMLHttpRequest();
            request.open('GET',url, true);
            request.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (this.status >= 200 && this.status < 400) resolve(this.responseText);
                    else reject(new Error('Failed getting from: ' + url));
                }
            };
            request.send();
        });
    }

    return getScript;
}
