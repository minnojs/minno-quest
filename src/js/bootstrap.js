/*jshint unused: vars */
define(['./config'], function(){
    require.config({
        map: {
            '*': {
                pipAPI: 'APIs/pipAPI',
                questAPI: 'APIs/questAPI',
                managerAPI: 'APIs/managerAPI'
            }
        }
    });

    require(['angular','app'], function(angular, app) {
        angular.element(document).ready(function() {
            var el = document.getElementById('pi-app');
            if (el) {
                angular.bootstrap(el, [app.name]);
            }
			// else: allow manual bootstrapping
        });
    });
});