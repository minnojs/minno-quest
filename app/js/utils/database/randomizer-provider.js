define(['underscore'],function(_){

	//RandomizerProvider.$inject = ['database.randomize.randomInt', 'database.randomize.randomArr', 'database.collection'];
	RandomizerProvider.$inject = ['database.randomizer.randomInt', 'database.randomizer.randomArr', 'Collection'];
	function RandomizerProvider(randomInt, randomArr, Collection){
		
		function Randomizer(){
			this._cache = {
				random : {},
				exRandom : {},
				sequential : {}
			};
		}

		_.extend(Randomizer.prototype, {
			random: random,
			exRandom: exRandom,
			sequential: sequential
		});

		return Randomizer;

		function random(length, seed, repeat){
			var cache  = this._cache.random;

			if (repeat && !_.isUndefined(cache[seed])) {
				return cache[seed];
			}

			// save result in cache
			cache[seed] = randomInt(length);

			return cache[seed];
		}

		function sequential(length, seed, repeat){
			var cache = this._cache.sequential;
			var coll = cache[seed];
			var result;

			// if needed create collection and set it in seed
			if (_.isUndefined(coll)){
				coll = cache[seed] = new Collection(_.range(length));
				return coll.first();
			}
			
			// if this is a repeated element:
			if (repeat) {
				return coll.current();
			} 

			// if we've reached the end 
			result = coll.next();

			// if we've reached the end of the collection (next)
			if (_.isUndefined(result)){
				return coll.first();
			} else {
				return result;
			}
		}

		function exRandom(length, seed, repeat){
			var cache = this._cache.exRandom;
			var coll = cache[seed];
			var result;

			// if needed create collection and set it in seed
			if (_.isUndefined(coll)){
				coll = cache[seed] = new Collection(randomArr(length));
				return coll.first();
			}
			
			// if this is a repeated element:
			if (repeat) {
				return coll.current();
			} 

			// if we've reached the end 
			result = coll.next();

			// if we've reached the end of the collection (next)
			// we should re-randomize
			if (_.isUndefined(result)){
				coll = cache[seed] = new Collection(randomArr(length));
				return coll.first();
			} else {
				return result;
			}
		}

	}

	return RandomizerProvider;

});