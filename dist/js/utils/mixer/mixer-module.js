define(function(require){
	require('utils/randomize/randomizeModule');

	var angular = require('angular');
	var module = angular.module('mixer',['randomize']);

	module.service('mixer', require('./mixer'));
	module.service('mixerSequential', require('./mixerSequential'));
	module.service('mixerRecursive', require('./mixerRecursive'));
	module.service('MixerSequence', require('./mixerSequenceProvider'));


	module.value('dotNotation', require('./branching/dotNotation'));
	module.service('mixerDotNotation', require('./branching/mixerDotNotationProvider'));
	module.service('mixerCondition', require('./branching/mixerConditionProvider'));
	module.service('mixerEvaluate', require('./branching/mixerEvaluateProvider'));
	module.config(['$provide', function($provide){
		$provide.decorator('mixer', require('./branching/mixerBranchingDecorator'));
	}]);
	module.constant('mixerDefaultContext', {});



	return module;
});