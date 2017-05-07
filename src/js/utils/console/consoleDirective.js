define(function (require) {
	// This is the only way to get a non js file relatively
    var template = require('text!./console.html');
    var _ = require('underscore');

    directive.$inject = ['$rootScope'];
    function directive($rootScope){
        return {
            replace: true,
            template:template,
            link: function(scope) {
                var logs = scope.logs = [];

                scope.remove = remove;
                scope.reverse = true;

                $rootScope.$on('console:log', function(scope, log){
                    logs.push(log);
                });

                function remove(log){
                    var index = _.indexOf(logs, log);
                    if (index > -1) {
                        logs.splice(index, 1);
                    }
                }
            }
        };
    }

    return directive;
});