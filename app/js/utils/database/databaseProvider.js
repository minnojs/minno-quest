define(function(require){
	var _ = require('underscore');

	DatabaseProvider.$inject = ['DatabaseStore', 'DatabaseRandomizer', 'databaseInflate'];
	function DatabaseProvider(Store, Randomizer, inflate){

		function Database(){
			this.store = new Store();
			this.randomizer = new Randomizer();
		}

		_.extend(Database.prototype, {
			get: function(namespace, query){
				var coll = this.store.read(namespace);
				return inflate(query, coll, this.randomizer);
			},
			create: function(namespace){
				this.store.create(namespace);
			},
			add: function(namespace, obj){
				this.store.add(obj);
			}
		});

		return Database;
	}

	return DatabaseProvider;
});