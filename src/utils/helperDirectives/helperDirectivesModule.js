
import angular from 'angular';
var module = angular.module('piHelperDirective', []);

module.directive('piSwap', piSwapDirective);
import piSwapDirective from './piSwap/piSwapDirective';
module.directive('piSpinner', piSpinnerDirective);
import piSpinnerDirective from './piSpinner/piSpinnerDirective';

export default module;
