define(function(require){
    var _ = require('underscore');

    function SequenceProvider(){

        function Sequence(arr, db){
            if (!db){
                throw new Error('Sequences need to take a db as the second argument');
            }

            this.sequence = db.sequence('pages', arr);
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
                var questionsArr,
                    page = this.sequence.current(context, {skip:['questions']}); // don't template the questions array

                if (!page){
                    return page;
                }

                if (page.questions){
                    questionsArr = _.isArray(page.questions) ? page.questions : [page.questions];
                } else {
                    questionsArr = [];
                }

                var questions = this.db.sequence('questions', questionsArr).all({
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
