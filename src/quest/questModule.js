/*
 *	One module to rule them all.
 *	This module is responsible to pull together all the piquest components.
 *	Calling it should suffice to activate the whole piquest stuff.
 */


import angular from 'angular';
import questTaskModule from './task/questTaskModule';
import questDirectivesModule from './directives/questDirectivesModule';

export default module;

var module = angular.module('piQuest', [
    questDirectivesModule.name,
    questTaskModule.name
]);

