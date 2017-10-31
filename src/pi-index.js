import angular from 'angular';
import _ from 'lodash';
import manager from './APIs/PImanagerAPI';
import time from './APIs/PItimeAPI';
import quest from './APIs/PIquestAPI';
import {define} from 'requirejs/require';
import app from './app';

var noop = function(){};
if (!window.console) window.console = {log:noop,info:noop,error:noop};

// setup amd loader with common packages
define('managerAPI', _.constant(manager));
define('timeAPI', _.constant(time));
define('pipAPI', _.constant(time));
define('questAPI', _.constant(quest));
define('lodash', _.constant(_));
define('underscore', _.constant(_));
define('angular', _.constant(angular));

// integrate with erroception
app.config(['$provide',function($provide) {
    $provide.decorator('$exceptionHandler', ['$delegate','$window', function($delegate, $window) {
        return function(exception, cause) {
            $window._errs && $window._errs.push(exception);
            $delegate(exception, cause);
        };
    }]);
}]);

angular.element(document).ready(function() {
    var el = document.getElementById('pi-app');
    if (el) activate(el);
});


function activate(el){
    angular.bootstrap(el, [app.name]);
}

export default activate;
