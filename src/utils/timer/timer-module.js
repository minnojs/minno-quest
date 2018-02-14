import angular from 'angular';
import timerStopper from './timerStopper';
import timerDirective from './timerDirective';
import timerNow from './timerNow';

var module = angular.module('timer',[]);

module.service('timerStopper', timerStopper);
module.directive('piTimer', timerDirective);
module.value('timerNow', timerNow);

export default module;
