define(['underscore'],function(_){

	queryProvider.$inject = ['database.randomizer'];
	function queryProvider(randomize){

		function queryFn(collection, query){
			var coll = _(collection);

			// shortcuts:
			// ****************************

			// use function instead of query object.
			if (_.isFunction(query)){
				return query(collection);
			}

			// pure string query
			if (_.isString(query) || _.isNumber(query)){
				query = {set:query, method:'random'};
			}

			// narrow down by set
			// ****************************
			if (query.set){
				coll = coll.where({set:query.set});
			}



			// narrow down by select
			// ****************************
			if (_.isPlainObject(query.select)){
				coll = coll.where({data:query.select});
			}

			if (_.isFunction(query.select)){
				coll = coll.filter(query.select);
			}

			// pick by method
			// ****************************
			switch (query.method){
				case undefined:
				case 'random':
					return coll.at(randomize(coll.length)).valueOf()[0];
				case 'first':
					return coll.at(0).valueOf()[0];
				default:
					throw new Error('Unknow method: ' + query.method);
			}
		}

		return queryFn;
	}

	return queryProvider;
});


seeds = {
	static : function(){
		return number
	}
}