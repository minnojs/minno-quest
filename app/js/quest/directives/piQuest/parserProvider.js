/*
 *	Takes a script and creates the essential quesetionnaire task object.
 */

define(function(require){
	var _ = require('underscore');

	ParserProvider.$inject = ['database','mixer'];
	function ParserProvider(Database, mixer){

		function Parser(script){
			this.script = script;
			this.db = new Database();

			this.db.create('pages', script.pagesSet);
			this.db.create('questions', script.questionsSet);

			this.sequence = mixer(script.sequence);

			// @TODO: do something with settings
		}

		_.extend(Parser.prototype, {
			next: function(last){
				// we can use last to determine what type of next this is...
				var next = this.sequence.next();
				var that = this;
				if (!next) {
					console.log('finished questionaire...');
					return true;
				}

				// returns a new object, we don't have a problem modifying it
				next = this.db.inflate('pages', next);
				next.questions = _.map(next.questions, function(question){
					return that.db.inflate('questions',question);
				});

				return next;
			}
		});

		return Parser;
	}

	return ParserProvider;
});