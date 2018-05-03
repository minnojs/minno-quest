import angular from 'angular';
import _ from 'lodash';
import sequencer from 'minno-sequencer';
import manager from './APIs/PImanagerAPI';
import time from './APIs/timeAPI';
import quest from './APIs/questAPI';
import dscore from './utils/dscore/Scorer';
import {define} from 'requirejs/require';
import app from './app';

// setup amd loader with common packages
define('managerAPI', _.constant(manager));
define('timeAPI', _.constant(time));
define('pipAPI', _.constant(time));
define('questAPI', _.constant(quest));
define('minno-sequencer', _.constant(sequencer));
define('lodash', _.constant(_));
define('underscore', _.constant(_));
define('angular', _.constant(angular));
define('pipScorer', _.constant(dscore));
define('dscore', _.constant(dscore));

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
    var el = document.getElementById('minno-app');
    if (el) activate(el);
});


function activate(el){
    angular.bootstrap(el, [app.name]);
}

export default activate;
