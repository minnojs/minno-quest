import angular from 'angular';
import _ from 'lodash';
import manager from './APIs/managerAPI';
import time from './APIs/timeAPI';
import quest from './APIs/questAPI';
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

export default activate;

angular.element(document).ready(function() {
    var el = document.getElementById('minno-app');
    if (el) activate(el);
});

function activate(el){
    angular.bootstrap(el, [app.name]);
}
