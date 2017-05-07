/**
 * Swap directive
 * Enables a slide-show type interface.
 * It exposes a controller with the next/prev/refresh/empty methods.
 * Each time next is called, the content is re-compiled and animated in, and old content is animated out.
 *
 * @param  {[type]} require [description]
 * @return {[type]}         [description]
 */
define(function (require) {
    // get template
    var _  = require('underscore');

    swapControler.$inject = ['$scope'];
    function swapControler($scope){
        this.$scope = $scope;
    }

    _.extend(swapControler.prototype, {
        next : function(props, options){
            this.$scope.enter(props, options);
        },
        prev: function(props, options){
            this.$scope.enter(props, options);
        },
        refresh: function(props){
            this.$scope.refresh(props);
        },
        empty: function(options){
            this.$scope.empty(options);
        }
    });

    swapDirective.$inject = ['$compile', '$animate', '$injector'];
    function swapDirective($compile, $animate, $injector){
        return {
            //replace: true,
            transclude: true,
            controller: swapControler,
            controllerAs: 'ctrl',
            compile: function(){
                return {
                    pre: this.pre,
                    post: function(){}
                };
            },
            pre: function($scope, $element, $attr, $ctrls, $transclude) {
                $scope.enter = enter;
                $scope.empty = cleanupLast;
                $scope.refresh = refresh;

                var currentScope, // the scope of the current element
                    currentElement, // an entering element (up until it leaves)
                    previousElement, // an element that is currently leaving
                    parentElement = $element;

                function cleanupLast(opts) {
                    var options = opts || {};

                    if(previousElement) {
                        previousElement.remove();
                        previousElement = null;
                    }
                    if(currentScope) {
                        currentScope.$destroy();
                        currentScope = null;
                    }
                    if(currentElement) {
                        $animate.leave(currentElement, function() {
                            previousElement = null;
                            options.postLeave && options.postLeave();
                        });
                        previousElement = currentElement;
                        currentElement = null;
                    }
                }

                function enter(props, opts){
                    var options = opts || {};
                    options.pre && options.pre();

                    if (!props){
                        return cleanupLast(options);
                    }

                    // create new scope and extend it with props
                    var newScope = _.extend($scope.$new(), props);

                    // create new element
                    $transclude(newScope, function(clone){

                        // @TODO: add animation info
                        // clone.addClass(direction); // maybe add this to the parent? how do we control both enter and leave with this method?
                        addAnimations(clone, options.animate);

                        // First send away the previous element (if it exists)
                        cleanupLast(options);

                        // Instantiate new element
                        currentElement = clone;

                        currentScope = newScope;

                        // Animate it in
                        $animate.enter(currentElement, parentElement, null, function(){
                            options.post && options.post();
                        });
                    });
                }

                function refresh(props){
                    _.extend(currentScope, props);
                }

                function addAnimations(element, animationsStr){
                    if (!animationsStr){
                        return;
                    }

                    var animations = animationsStr.split(' ');

                    _.each(animations, function(animation){
                        // Make sure that this animation exists
                        if (!$injector.has('.' + animation + '-animation')){
                            throw new Error('Unknown animation type: "' + animation + '"');
                        }

                    });

                    element.addClass(animationsStr);
                }


            }
        };
    }

    return swapDirective;
});
