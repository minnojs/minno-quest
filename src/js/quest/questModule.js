/*
 *	One module to rule them all.
 *	This module is responsible to pull together all the piquest components.
 *	Calling it should suffice to activate the whole piquest stuff.
 */
define(function(require){
    
    var angular = require('angular');
    var module = angular.module('piQuest', [
        require('quest/directives/questDirectivesModule').name,
        require('quest/task/questTaskModule').name
    ]);

    return module;
});
