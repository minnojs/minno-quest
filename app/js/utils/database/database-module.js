define(function(require){
	var 
		angular = require('angular'),
		Collection = require('./collection-provider'),
		Randomizer = require('./randomizer-provider'),
		Store = require('./store-provider'),
		query = require('./query-provider'),
		randomInt = require('./randomInt'),
		randomArr = require('./randomArr');
	
	var module = angular.module('database',[])
		.service('Collection', Collection)
		.value('database.randomizer.randomInt', randomInt)
		.value('database.randomizer.randomArr', randomArr)
		.service('Randomizer', Randomizer)
		.service('query', query)
		.service('Store', Store);

	return module;
});