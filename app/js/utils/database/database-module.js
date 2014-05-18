define(function(require){
	var
		angular = require('angular'),
		Database = require('./databaseProvider'),
		Collection = require('./collectionProvider'),
		Randomizer = require('./randomizerProvider'),
		Store = require('./storeProvider'),
		query = require('./queryProvider'),
		inflate = require('./inflateProvider'),
		randomInt = require('./randomInt'),
		randomArr = require('./randomArr');

	var module = angular.module('database',[])
		.value('databaseRandomizerRandomInt', randomInt)
		.value('databaseRandomizerRandomArr', randomArr)
		.service('Collection', Collection)
		.service('DatabaseRandomizer', Randomizer)
		.service('databaseQuery', query)
		.service('databaseInflate', inflate)
		.service('DatabaseStore', Store)
		.service('Database', Database);


	return module;
});