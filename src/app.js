/**
 *	The main module that ties the whole application together.
 *	Essentially, we are creating a module with dependencies on anything interesting...
 */

import _ from 'lodash';
import angular from 'angular';
import questModule from './quest/questModule';
import messageModule from './message/messageModule';
import managerModule from './taskManager/managerModule';
import animationModule from './utils/animations/animationModule';
import consoleModule from './utils/console/consoleModule';
import {require,define,requirejs} from 'requirejs/require';

export default app;

// requirejs does not explicitly export these as globals
window.require = require;
window.requirejs = requirejs;
window.define = define;

var submodules = [
    questModule.name,
    messageModule.name,
    managerModule.name,
    animationModule.name,
    consoleModule.name
];

var app = angular.module('piApp', submodules);

// setup the global variable
app.run(['$rootScope', '$rootElement', '$parse', '$window', function($rootScope, $rootElement, $parse, $window){
    // @TODO: get these out of here (app.config? app.run?)
    var globalAttr = $rootElement.attr('pi-global');
    var piGlobal = $parse(globalAttr)($window);

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


