define(['underscore'],function(_){
	/*
	 * The constructor for an Array wrapper
	 */

	var Collection = function Collection (arr) {

		if (!_.isUndefined(arr) && !_.isArray(arr)) {
			throw new Error(arr.toString() + 'is not an Array');
		}
		this.collection = arr || [];
		this.lenght = this.collection.length;

		// pointer to the current location within the array
		// we start with -1 so that the initial next points to the begining of the array
		this.pointer = -1;
	};

	_.extend(Collection.prototype,{

		first : function first(){
			this.pointer = 0;
			return this.collection[this.pointer];
		},

		last : function last(){
			this.pointer = this.collection.length - 1;
			return this.collection[this.pointer];
		},

		end : function end(){
			this.pointer = this.collection.length;
			return undefined;
		},

		current : function(){
			return this.collection[this.pointer];
		},

		next : function(){
			return this.collection[++this.pointer];
		},

		previous : function(){
			return this.collection[--this.pointer];
		},

		// add list of items to the collection
		add : function(list){
			// dont allow adding nothing
			if (!arguments.length) {
				return this;
			}

			// make sure list is as an array
			list = _.isArray(list) ? list : [list];
			this.collection = this.collection.concat(list);

			this.length = this.collection.length;

			return this;
		},

		// return the item at index
		at: function(index){
			return this.collection[index];
		}
	});

/*
Stuff we took out of bootstrap that can augment the collection
*******************************

  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf',
    'isEmpty', 'chain'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });
*/



	return Collection;
});