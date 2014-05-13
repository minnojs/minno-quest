define(['underscore'],function(_){

	queryProvider.$inject = ['Collection'];
	function queryProvider(Collection){

		function queryFn(query, collection, randomizer){
			var coll = new Collection(collection);

			// shortcuts:
			// ****************************

			// use function instead of query object.
			if (_.isFunction(query)){
				return query(collection);
			}

			// pure string query
			if (_.isString(query) || _.isNumber(query)){
				query = {set:query, type:'random'};
			}

			// narrow down by set
			// ****************************
			if (query.set){
				coll = coll.where({set:query.set});
			}

			// narrow down by data
			// ****************************
			if (_.isPlainObject(query.data)){
				coll = coll.where({data:query.data});
			}

			if (_.isFunction(query.data)){
				coll = coll.filter(query.data);
			}

			// pick by type
			// ****************************

			var seed = query.seed || query.set;
			var length = coll.length;
			var repeat = query.repeat;
			var at;

			switch (query.type){
				case undefined:
				case 'byData':
				case 'random':
					at = randomizer.random(length,seed,repeat);
					break;
				case 'exRandom':
					at = randomizer.exRandom(length,seed,repeat);
					break;
				case 'sequential':
					at = randomizer.sequential(length,seed,repeat);
					break;
				case 'first':
					at = 0;
					break;
				case 'last':
					at = length-1;
					break;
				default:
					throw new Error('Unknow query type: ' + query.type);
			}

			if (_.isUndefined(coll.at(at))) {
				throw new Error('Query failed, object (' + JSON.stringify(query) +	') not found.');
			}

			return coll.at(at);
		}

		return queryFn;
	}

	return queryProvider;
});