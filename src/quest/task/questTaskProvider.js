import stream from 'mithril-stream';
import createLogStream from './logger/createLogStream';
import dfltQuestLogger from './logger/dfltQuestLogger';
import _ from 'lodash';

TaskProvider.$inject = ['$q','Database','QuestSequence','taskParse', '$rootScope'];
function TaskProvider($q, Database, QuestSequence, parse, $rootScope){
    function Task(script){
        var self = this;
        var settings = script.settings || {};
        var global = $rootScope.global;

        if (!_.isArray(script.sequence)) throw new Error('Task: no sequence was defined'); // shouldn't ever be thrown

        // save script for later use...
        this.script = script;
        this.db = new Database();
        this.sequence = new QuestSequence(script.sequence, this.db);
        this.$logSource = stream();
        this.$logs = createLogStream(this.$logSource, settings.logger || {}, dfltQuestLogger);
        this.q = $q.defer();

        this.promise = this.q.promise
            .then(function(){
                // check if there are unlogged questions and log them
                _.each($rootScope.current.questions, function(quest){
                    if(quest.$logged){ return true; }
                    self.log(quest, {}, global);
                    quest.$logged = true;
                });
                // a bug in mithril-stream prevents the parent stream from closing the child
                self.$logSource.end(true);
                self.$logs.end(true);
            })['finally'](settings.onEnd || _.noop); // end only after logging has finished (regardless of success)

        parse(script, this.db);
    }

    _.extend(Task.prototype, {
        log: function(){
            this.$logSource.call(null, [].slice.call(arguments));
        },
        current: function(){
            var nextObj = this.sequence.current();
            if (!nextObj) this.end();
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
