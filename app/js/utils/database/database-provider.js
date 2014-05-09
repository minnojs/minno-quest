define(function(require){
	var _ = require('underscore');

	DatabaseProvider.$inject = ['Store', 'Randomizer', 'query'];
	function DatabaseProvider(Store, Randomizer, query){

		function Database(){

			return {
				store: new Store(),

			};

		}

		return Database;
	}

	return DatabaseProvider;
});