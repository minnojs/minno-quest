define(function(require){
	var _ = require('underscore');
	var angular = require('angular');
	var module = angular.module('mixer',[]);

	module.service('mixer', require('./mixer'));
	module.value('mixerShuffle', _.shuffle);
	module.value('mixerRandom', function(){return Math.random();});

	return module;
});