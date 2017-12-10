import angular from 'angular';
import stream from 'mithril-stream';
import _ from 'lodash';

TaskProvider.$inject = ['$q','Database','Logger','QuestSequence','taskParse', 'dfltQuestLogger', '$rootScope'];
function TaskProvider($q, Database, Logger, QuestSequence, parse, dfltQuestLogger,$rootScope){
    function Task(script){
        var self = this;
        var settings = script.settings || {};

        // save script for later use...
        this.script = script;
        this.db = new Database();
        this.$logSource = stream();
        this.logger = new Logger(this.$logSource, settings.logger || {}, dfltQuestLogger);
        this.q = $q.defer();

        if (!_.isArray(script.sequence)) throw new Error('Task: no sequence was defined');

        this.sequence = new QuestSequence(script.sequence, this.db);

        this.promise = this.q.promise
            .then(function(){
                // check if there are unlogged questions and log them
                _.each($rootScope.current.questions, function(quest){
                    if(quest.$logged){ return true; }
                    self.log(quest, {}, $rootScope.global);
                    quest.$logged = true;
                });
                self.logger.end(true);
            })['finally'](settings.onEnd || angular.noop); // end only after logging has finished (regardless of success)

        parse(script, this.db);
    }

    _.extend(Task.prototype, {
        log: function(){
            this.$logSource.call(null, [].slice.call(arguments));
        },
        current: function(){
            var nextObj = this.sequence.current();

            if (!nextObj){
                this.end();
            }

            return nextObj;
        },
        next: function(){
            return this.sequence.next();
        },
        prev: function(){
            return this.sequence.prev();
        },

        end: function(){
            this.q.resolve();
        }
    });

    return Task;
}

export default TaskProvider;
