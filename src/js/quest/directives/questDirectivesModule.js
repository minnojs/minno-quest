define(function(require){
	var angular = require('angular');
	var _ = require('underscore');


	// set modules that are requirements for the quest module
	var module = angular.module('questDirectives',[
		require('utils/timer/timer-module').name,
		require('./buttons/buttons').name,
		require('utils/template/templateModule').name,
		require('utils/console/consoleModule').name
	]);

	module.controller('questController', require('./questController'));
	module.directive('piQuest', require('./piQuest/piQuest-directive'));
	module.directive('piqPage', require('./piQuest/piqPage-directive'));
	module.directive('questWrapper', require('./wrapper/wrapper-directive'));
	module.directive('questText', require('./text/text-directive'));
	module.directive('questTextNumber', require('./text/text-number-directive'));

	module.service('questSelectMixer', require('./select/selectMixerProvider'));
	module.directive('questDropdown',require('./select/dropdownDirective'));
	module.directive('questSelectOne',require('./select/selectOneDirective'));
	module.directive('questSelectMulti',require('./select/selectMultiDirective'));

	module.filter('toRegex', ['piConsole', function($console){
		return toRegex;

		function toRegex(value) {
			var err;

			if (_.isUndefined(value)){
				return /(?:)/;
			}

			if (_.isRegExp(value) || _.isString(value)){
				return new RegExp(value);
			} else {
				err = new Error('Question pattern is not a valid regular expression');
				$console('text').error(err, value);
				throw err;
			}
		}
	}]);

	return module;


});
