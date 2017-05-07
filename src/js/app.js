/**
 *	The main module that ties the whole application together.
 *	Essentially, we are creating a module with dependencies on anything interesting...
 */
define(function (require) {

    var angular = require('angular');
    var _ = require('underscore');
    var fastClick = require('fastclick');

    var submodules = [
        require('quest/questModule').name,
        require('message/messageModule').name,
        require('taskManager/managerModule').name,
        require('utils/animations/animationModule').name,
        require('utils/console/consoleModule').name
    ];

    var app = angular.module('piApp', submodules);

    // setup the global variable
    app.run(['$rootScope', '$rootElement', '$parse', '$window', function($rootScope, $rootElement, $parse, $window){
        // @TODO: get these out of here (app.config? app.run?)
        var globalAttr = $rootElement.attr('pi-global');
        var piGlobal = $parse(globalAttr)($window);

        fastClick.attach(document.body, {tapDelay:100});
        // create the global object
        window.piGlobal || (window.piGlobal = {});
        $rootScope.global = window.piGlobal;

        if (piGlobal){
            _.extend($rootScope.global, piGlobal);
        }
    }]);

    // monkey patch an IOS8 problem
    // https://github.com/angular/angular.js/issues/9128
    app.config(['$provide', function($provide) {

        // http://ejohn.org/blog/objectgetprototypeof/
        if ( typeof Object.getPrototypeOf !== 'function' ) {
            if ( typeof 'test'.__proto__ === 'object' ) {
                Object.getPrototypeOf = function(object){
                    return object.__proto__;
                };
            } else {
                Object.getPrototypeOf = function(object){
                    // May break if the constructor has been tampered with
                    return object.constructor.prototype;
                };
            }
        }



        // Minification-safe hack.
        var $$watchers = '$$watchers';
        var $$nextSibling = '$$nextSibling';
        var $$childHead = '$$childHead';
        var $$childTail = '$$childTail';
        var $$listeners = '$$listeners';
        var $$listenerCount = '$$listenerCount';
        var $id = '$id';
        var $$childScopeClass = '$$childScopeClass';
        var $parent = '$parent';
        var $$prevSibling = '$$prevSibling';

        $provide.decorator('$rootScope', ['$delegate', function($rootScope) {
            var proto = Object.getPrototypeOf($rootScope);

            function nextUid () {
                return ++$rootScope.$id;
            }

            proto.$new = function(isolate) {
                var child;

                if (isolate) {
                    child = new proto.constructor();
                    child.$root = this.$root;
                    // ensure that there is just one async queue per $rootScope and its children
                    child.$$asyncQueue = this.$$asyncQueue;
                    child.$$postDigestQueue = this.$$postDigestQueue;
                } else {
                    // Only create a child scope class if somebody asks for one,
                    // but cache it to allow the VM to optimize lookups.
                    if (!this.$$childScopeClass) {
                        this.$$childScopeClass = function() {
                            this[$$watchers] = this[$$nextSibling] = this[$$childHead] = this[$$childTail] = null;
                            this[$$listeners] = {};
                            this[$$listenerCount] = {};
                            this[$id] = nextUid();
                            this[$$childScopeClass] = null;
                        };
                        this.$$childScopeClass.prototype = this;
                    }
                    child = new this.$$childScopeClass();
                }
                child['this'] = child;
                child[$parent] = this;
                child[$$prevSibling] = this.$$childTail;
                if (this.$$childHead) {
                    this.$$childTail.$$nextSibling = child;
                    this.$$childTail = child;
                } else {
                    this.$$childHead = this.$$childTail = child;
                }
                return child;
            };

            $rootScope.$new = proto.$new;
            return $rootScope;
        }]);

    }]);


    return app;
});
