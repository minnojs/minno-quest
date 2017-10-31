import angular from 'angular';
import 'angular-animate';
import './rafPolyfill';
import dropInAnimation from './dropInAnimation';
import fadeAnimation from './fadeAnimation';
import slideAnimation from './slideAnimation';

var module = angular.module('pi.animate',['ngAnimate']);

module.animation('.drop-in', dropInAnimation);
module.animation('.fade', fadeAnimation);
module.animation('.slide', slideAnimation);

export default module;
