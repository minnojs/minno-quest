define(function(require){

	var
		angular = require('angular'),
		Database = require('./databaseProvider'),
		Collection = require('./collectionProvider'),
		Randomizer = require('./randomizerProvider'),
		Store = require('./storeProvider'),
		query = require('./queryProvider'),
		inflate = require('./inflateProvider');

	var module = angular.module('database',[
			require('utils/randomize/randomizeModule').name,
			require('utils/console/consoleModule').name
		])
		.service('Collection', Collection)
		.service('DatabaseRandomizer', Randomizer)
		.service('databaseQuery', query)
		.service('databaseInflate', inflate)
		.service('DatabaseStore', Store)
		.service('Database', Database);

	return module;
});