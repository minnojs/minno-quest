define(function(require){
	var angular = require('angular');
	require('utils/timer/timer-module');

	// set modules that are requirements for the quest module
	var module = angular.module('questDirectives',['timer']);
	module.controller('questController', require('./questController'));
	module.directive('piQuest', require('./piQuest/piQuest-directive'));
	module.directive('piqPage', require('./piQuest/piqPage-directive'));
	module.directive('questWrapper', require('./wrapper/wrapper-directive'));
	module.directive('questText', require('./text/text-directive'));
	module.directive('questTextNumber', require('./text/text-number-directive'));

	module.service('questSelectMixer', require('./select/selectMixerProvider'));
	module.directive('questSelectOne',require('./select/selectOneDirective'));

	// work around for dynamic module and form names
	// https://github.com/angular/angular.js/issues/1404#issuecomment-30859987
	module.config(function($provide) {
			$provide.decorator('ngModelDirective', function($delegate) {
				var ngModel = $delegate[0], controller = ngModel.controller;
				ngModel.controller = ['$scope', '$element', '$attrs', '$injector', function(scope, element, attrs, $injector) {
					var $interpolate = $injector.get('$interpolate');
					attrs.$set('name', $interpolate(attrs.name || '')(scope));
					$injector.invoke(controller, this, {
						'$scope': scope,
						'$element': element,
						'$attrs': attrs
					});
				}];
				return $delegate;
			});
			$provide.decorator('ngFormDirective', function($delegate) {
				var form = $delegate[0], controller = form.controller;
				form.controller = ['$scope', '$element', '$attrs', '$injector', function(scope, element, attrs, $injector) {

					var $interpolate = $injector.get('$interpolate');
					attrs.$set('name', $interpolate(attrs.name || attrs.ngForm || '')(scope));
					$injector.invoke(controller, this, {
						'$scope': scope,
						'$element': element,
						'$attrs': attrs
					});
				}];
				return $delegate;
			});
		});



	return module;
});
