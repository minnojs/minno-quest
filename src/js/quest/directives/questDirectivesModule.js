define(function(require){
	var angular = require('angular');
	var _ = require('underscore');


	// set modules that are requirements for the quest module
	var module = angular.module('questDirectives',[
		require('utils/timer/timer-module').name,
		require('./buttons/buttons').name,
		require('utils/database/template/templateModule').name,
		require('utils/console/consoleModule').name,
		require('utils/modal/modalModule').name
	]);

	module.controller('questController', require('./questController'));
	module.directive('piQuest', require('./piQuest/piQuest-directive'));
	module.directive('piqPage', require('./piQuest/piqPage-directive'));
	module.directive('questWrapper', require('./wrapper/wrapper-directive'));
	module.directive('questText', require('./text/textDirective'));
	module.directive('questTextarea', require('./text/textDirective')); // uses the same directive as questText
	module.directive('questTextNumber', require('./text/text-number-directive'));

	module.service('questSelectMixer', require('./select/selectMixerProvider'));
	module.directive('questDropdown',require('./select/dropdownDirective'));
	module.directive('questSelectOne',require('./select/selectOneDirective'));
	module.directive('questSelectMulti',require('./select/selectMultiDirective'));

	module.directive('piQuestValidation', function(){
		return {
			replace:true,
			transclude: true,
			scope: {unvalid:'=piQuestValidation'},
			template: [
				'<div class="alert alert-danger" role="alert" ng-show="unvalid">',
			  		'<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>',
			  		'<span ng-transclude></span>',
				'</div>'
			].join('')
		};
	});

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
