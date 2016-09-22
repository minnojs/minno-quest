define(function(){

    var EVENTNAME = 'touchstart mousedown';
    var DIRECTIVENAME = 'piPointerdown';
    piPointerdownDirective.$inject = ['$parse'];
    function piPointerdownDirective($parse){
        return {
            compile: function($element, attr) {
                // We expose the powerful $event object on the scope that provides access to the Window,
                // etc. that isn't protected by the fast paths in $parse.  We explicitly request better
                // checks at the cost of speed since event handler expressions are not executed as
                // frequently as regular change detection.
                var fn = $parse(attr[DIRECTIVENAME], /* expensiveChecks */ true);
                return function piEventHandler(scope, element) {
                    element.on(EVENTNAME, listener);
                    scope.$on('$destroy', function(){
                        element.off(EVENTNAME, listener);
                    });

                    function listener(event) {
                        scope.$apply(function() {
                            fn(scope, {$event:event});
                        });
                    }
                };
            }
        };
    }

    return piPointerdownDirective;

});
