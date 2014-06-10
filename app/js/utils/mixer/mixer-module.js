define(function(require){
	require('utils/randomize/randomizeModule');

	var angular = require('angular');
	var module = angular.module('mixer',['randomize']);

	module.service('mixer', require('./mixer'));
	module.service('mixerSequential', require('./mixerSequential'));
	module.service('mixerRecursive', require('./mixerRecursive'));

	return module;
});