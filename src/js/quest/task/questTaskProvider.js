define(['underscore', 'angular'], function(_, angular){

    TaskProvider.$inject = ['$q','Database','Logger','QuestSequence','taskParse', 'dfltQuestLogger', '$rootScope'];
    function TaskProvider($q, Database, Logger, QuestSequence, parse, dfltQuestLogger,$rootScope){
        function Task(script){
            var self = this;
            var settings = script.settings || {};

            // save script for later use...
            this.script = script;
            this.db = new Database();
            this.logger = new Logger(dfltQuestLogger);
            this.logger.setSettings(settings.logger || {});
            this.q = $q.defer();

            if (!_.isArray(script.sequence)){
                throw new Error('Task: no sequence was defined');
            }

            this.sequence = new QuestSequence(script.sequence, this.db);

            this.promise = this.q.promise
            .then(function(){
                // check if there are unlogged questions and log them
                self.logger.suppressPulse(); // this is the end of the task, we want to post all the logs at once.
                _.each($rootScope.current.questions, function(quest){
                    if(quest.$logged){
                        return true;
                    }

                    /**
                     * logs to server
                     * @param {Object} log : the actual data regarding this log
                     * @param {Object} pageData : General inforamtion about this page
                     * @param {Object} global : The global object
                     */
                    self.log(quest, {}, $rootScope.global);
                    quest.$logged = true;
                });
                self.logger.suppressPulse(false); // turn suppress off
                return self.logger.send();
            })['finally'](settings.onEnd || angular.noop); // end only after logging has finished (regardless of success)

            parse(script, this.db);
        }

        _.extend(Task.prototype, {
            log: function(){
                this.logger.log.apply(this.logger, arguments);
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

    return TaskProvider;
});
