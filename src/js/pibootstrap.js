/*jshint unused: vars */
define(['./config'], function(){

    require.config({
        map: {
            '*': {
                pipAPI: 'APIs/PIpipAPI',
                questAPI: 'APIs/PIquestAPI',
                managerAPI: 'APIs/PImanagerAPI'
            }
        }
    });

    require(['angular','app'], function(angular, app) {

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
            if (el) {
                angular.bootstrap(el, [app.name]);
            }
			// else: allow manual bootstrapping
        });
    });
});