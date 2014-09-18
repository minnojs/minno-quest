define(function(require){
	var _ = require('underscore');

	SequenceProvider.$inject = ['TaskSequence'];
	function SequenceProvider(TaskSequence){

		function Sequence(arr, db){
			if (!db){
				throw new Error('Sequences need to take a db as the second argument');
			}

			this.sequence = new TaskSequence('pages', arr, db);
			this.db = db;
		}

		_.extend(Sequence.prototype, {
			next: function(context){
				this.sequence.next(context);
				return this;
			},

			prev: function(context){
				this.sequence.prev(context);
				return this;
			},

			current: function(context){
				var page = this.sequence.current(context);

				if (!page){
					return page;
				}

				var questions = new TaskSequence('questions', page.questions || [], this.db).all({
					pagesData: page.data,
					pagesMeta: page.$meta
				});

				// make sure we don't lose any thing in the orginal page
				// @TODO: this seems extremely expensive. Is this really neccesary?
				page = _.clone(page, true);
				page.questions = questions;

				return page;
			}
		});

		return Sequence;
	}

	return SequenceProvider;
});