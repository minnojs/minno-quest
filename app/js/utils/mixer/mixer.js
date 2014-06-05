define(['underscore'],function(_){

	/**
	 * A function that maps a mixer object into a sequence.
	 *
	 * The basic structure of such an obect is:
	 * {
	 *		mixer: 'functionType',
	 *		data: [task1, task2]
	 *	}
	 *
	 * @param {Object} [obj] [a mixer object]
	 * @returns {Array} [An array of mixed objects]
	 */

	mixProvider.$inject = ['mixerShuffle', 'mixerRandom'];
	function mixProvider(shuffle, random){

		function mix(obj){
			var result, i, sequence = obj.data || [];

			if (_.isUndefined(obj.mixer)){
				return [obj];
			}

			switch(obj.mixer){
				case 'wrapper':
					return sequence;

				case 'repeat':
					result = [];
					for (i=0; i < obj.times; i++){
						result = result.concat(sequence);
					}
					return result;

				case 'random':
					return shuffle(sequence);

				case 'choose':
					return _.first(shuffle(sequence), obj.n ? obj.n : 1);

				case 'weightedRandom':
					var total_weight = _.reduce(obj.weights,function (prev, cur) {
						return prev + cur;
					});

					var random_num = random() * total_weight; // cutoff - when we reach this sum - we've reached the desired weight
					var weight_sum = 0;

					for (i = 0; i < obj.data.length; i++) {
						weight_sum += obj.weights[i];
						weight_sum = +weight_sum.toFixed(3);

						if (random_num <= weight_sum) {
							return [obj.data[i]];
						}
					}
					throw new Error('Mixer: something went wrong with weightedRandom');

				default:
					throw new Error('Mixer: unknow mixer type = ' + obj.mixer);
			}
		}

		return mix;
	}

	return mixProvider;
});