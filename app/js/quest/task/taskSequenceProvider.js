define(function(require){
	var _ = require('underscore');

	// polyfill for IE8 that doesn't support object.create
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Polyfill
	if (typeof Object.create != 'function') {
		(function () {
			var F = function () {};
			Object.create = function (o) {
				if (arguments.length > 1) { throw new Error('Second argument not supported');}
				if (o === null) { throw new Error('Cannot set a null [[Prototype]]');}
				if (typeof o != 'object') { throw new TypeError('Argument must be an object');}
				F.prototype = o;
				return new F();
			};
		})();
	}

	SequenceProvider.$inject = ['Collection', 'mixerArray'];
	function SequenceProvider(Collection, mix){
		// classical inheritance from Collection
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Classical_inheritance_with_Object.create
		function Sequence(coll, db){
			Collection.call(this, coll);

			if (!db){
				throw new Error('Sequences need to take a db as the second argument');
			}
			this.db = db;
		}

		Sequence.prototype = Object.create(Collection.prototype);
		Sequence.prototype.constructor = Sequence;

		_.extend(Sequence.prototype, {
			// @TODO: we should add a system to use inline templates (Grunt style) when inflating.
			// maybe add a context argument here?
			buildPage: function(pageObj){
				if (_.isUndefined(pageObj)){
					return undefined;
				}

				var page = this.db.inflate('pages', pageObj);
				// we can afford to overwrite the original since inflate always creates new objects for us.
				page.questions = _.map(page.questions || [], function(question){
					return this.db.inflate('questions', question);
				}, this);

				return page;
			},
			proceed: function(){
				this.next();

				// return undefined at the end
				if (this.length === this.pointer){
					return undefined;
				}

				this.mix();
				var page = this.current();
				page = this.buildPage(page);
				return page;
			},

			mix: function(){
				var obj = this.current();
				var mixed = mix([obj]);
				var sequence = this.collection;

				// push the first arguments of splice into the mixer array...
				mixed.unshift(1); // how many objects to delete
				mixed.unshift(this.pointer); // where to start at
				sequence.splice.apply(sequence, mixed);

				// update sequence length
				this.length = sequence.length;
			}
		});

		return Sequence;
	}

	return SequenceProvider;
});