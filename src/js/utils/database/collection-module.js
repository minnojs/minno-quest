define(function(require){
	var angular = require('angular');
	var Collection = require('./collection');
	var module = angular.module('collection',[]);

	module.value('Collection', Collection);

	return module;
});