
import angular from 'angular';
var module = angular.module('timer',[]);

module.service('timerStopper', timerStopper);
import timerStopper from './timerStopper';
module.directive('piTimer', timerDirective);
import timerDirective from './timerDirective';
module.value('timerNow', timerNow);
import timerNow from './timerNow';

export default module;
