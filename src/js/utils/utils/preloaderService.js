define(function(require){
	var _ = require('underscore');

	preloaderService.$inject = ['$q', 'piConsole'];
	function preloaderService($q, $console){
		this.$q = $q;
        this.$console = $console;
		this.loaders = {};
		this.loaded = [];
	}

	_.extend(preloaderService.prototype, {
		register: preloaderRegister,
		load: preloaderLoad,
		loadArr: preloaderLoadArr,
		get: preloaderGet,
		getObj: preloaderGetObj
	});

	return preloaderService;

	/**
	 * register loader
	 * loader functions take a single parameter: the description
	 * and return a promise to be resolved with the result.
	 *
	 * @param  {String}   type The loader type
	 * @param  {Function} fn   The loader function itself (should return a promise to be resolved with the result)
	 */
	function preloaderRegister(type, fn){
		if (!_.isFunction(fn)){
			throw new Error('Fn is not a function');
		}

		this.loaders[type] = fn;
	}

	function preloaderLoad(type, description){
        var $console = this.$console;
		var loader = this.loaders[type];
		var promise, resultObj;

		// check if this description has already been loaded
		resultObj = this.getObj(type, description);
		if (!resultObj){
			resultObj = {type:type, description:description};
			this.loaded.push(resultObj);
		} else {
			return resultObj.promise;
		}

		// make sure loader was registered
		if (!_.isFunction(loader)){
			throw new Error('Loader "' + type + '" was not registered.');
		}

		// call loader
		promise = resultObj.promise = loader.call(this, description);

		// make sure loader returns a promise
		if (!isPromiseLike(promise)){
			throw new Error('Loader "' + type + '" must return a promise.');
		}

		// save result into the loaded array (we use an array in order to allow non string descriptions)
		promise
            .then(function(result){
                resultObj.promise = null; // so that the promise can be garbage collected
                resultObj.value = result;
                return result;
            })
            .catch(function(){
				$console('preload').error('Failed to preload:', type, ' - ', description);
            });

		return promise;
	}

	function preloaderLoadArr(type, descriptions){
		var $q = this.$q;
		var defs;

		if (!_.isArray(descriptions)){
			throw new Error('descriptions must be an array.');
		}

		defs = _.map(descriptions, function(description){
			return this.load(type, description);
		}, this);

		return $q.all(defs);
	}

	function preloaderGetObj(type, description){
		// get the
		var result = _.find(this.loaded, function(loadObj){
			return loadObj.type === type && loadObj.description === description;
		}, this);

		return result;
	}

	function preloaderGet(type, description){
		var result = this.getObj(type, description);

		if (!('value' in result)){
			throw new Error('This object has not been loaded yet: "' + description + '"');
		}

		return result.value;
	}

	function isPromiseLike(obj){
		return _.isPlainObject(obj) && _.isFunction(obj.then);
	}
});
