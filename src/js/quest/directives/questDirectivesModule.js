define(function(require){
	var angular = require('angular');
	require('utils/timer/timer-module');
	require('./buttons/buttons');
	require('utils/template/templateModule');

	// set modules that are requirements for the quest module
	var module = angular.module('questDirectives',['timer', 'ui.bootstrap.buttons', 'template', require('utils/console/consoleModule').name]);

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

	return module;
});
