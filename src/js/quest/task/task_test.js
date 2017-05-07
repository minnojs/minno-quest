define(['underscore','./questTaskModule'],function(){

    describe('QuestTask',function(){
        var task;
        var sendSpy = jasmine.createSpy('send');
        var logSpy = jasmine.createSpy('log');
        var createSpy = jasmine.createSpy('create');
        var parseSpy = jasmine.createSpy('parse');
        var nextSpy = jasmine.createSpy('next').andReturn('nextObj');
        var script = {sequence:[]};

		// stubout constructors
        beforeEach(module('task', 'logger','database', function($provide) {
            $provide.value('Logger', jasmine.createSpy('Logger').andCallFake(function(){
                this.send = sendSpy;
                this.log = logSpy;
                this.suppressPulse = jasmine.createSpy('suppressPulse');
                this.setSettings = jasmine.createSpy('setSettings');
            }));
            $provide.value('Database', function(){
                this.createColl = createSpy;
            });
            $provide.value('taskParse',parseSpy);
            $provide.value('QuestSequence',function(){
                this.next = function(){return this;};
                this.prev = function(){return this;};
                this.current = nextSpy;
            });
        }));

        beforeEach(inject(function(QuestTask, $rootScope){
            $rootScope.current = {questions:{}};
            task = new QuestTask(script);
        }));

        it('should setup the db', inject(function(Database){
            expect(task.db).toBeDefined();
            expect(task.db).toEqual(jasmine.any(Database));
        }));

        it('should setup the sequence', inject(function(QuestSequence){
            expect(task.sequence).toBeDefined();
            expect(task.sequence).toEqual(jasmine.any(QuestSequence));
        }));

        it('should setup the logger', inject(function(QuestTask){
            var script = {
                sequence:[],
                settings: {
                    logger:{a:1}
                }
            };
            task = new QuestTask(script);
            expect(task.logger.setSettings).toHaveBeenCalledWith(script.settings.logger);
        }));

        it('should call settings.onEnd at the end of the task (if there is no endObject)', inject(function(QuestTask, $rootScope){
            var script = {
                sequence:[],
                settings: {
                    onEnd:jasmine.createSpy('onEnd')
                }
            };
            task = new QuestTask(script);
            nextSpy.andReturn(undefined);
            task.current();
            $rootScope.$apply();
            expect(script.settings.onEnd).toHaveBeenCalled();
            nextSpy.andReturn('nextObj');
        }));

        it('should log anything left at the end of the task', inject(function($rootScope){
            $rootScope.current.questions = {1:{test:1}, 2:{test:2, $logged:true}};
            nextSpy.andReturn(undefined);
            task.current();
            $rootScope.$apply();
            var q1 = $rootScope.current.questions[1];
            expect(task.logger.log.calls.length).toBe(1);
            expect(task.logger.log).toHaveBeenCalledWith(q1,{}, undefined);
            expect(q1.$logged).toBeTruthy();
        }));

        it('should `send` anything left at the end of the task', inject(function($rootScope){
            nextSpy.andReturn(null);
            task.current();
            $rootScope.$apply();
            expect(sendSpy).toHaveBeenCalled();
            expect(task.logger.suppressPulse).toHaveBeenCalled(); // prevent breaking the final send into pulses
            nextSpy.andReturn('nextObj');
        }));

        it('should call `onEnd` only after `send` is called', inject(function(QuestTask, $rootScope, $q){
            var def = $q.defer();
            var script = {
                sequence:[],
                settings: {
                    onEnd:jasmine.createSpy('onEnd').andCallFake(function(){
                        expect(sendSpy).toHaveBeenCalled();
                    })
                }
            };
            task = new QuestTask(script);
            nextSpy.andReturn(undefined);
            sendSpy.andReturn(def.promise);
            task.current();
            $rootScope.$apply();
            expect(sendSpy).toHaveBeenCalled();
            expect(script.settings.onEnd).not.toHaveBeenCalled();
            def.resolve();
            $rootScope.$apply();
            expect(script.settings.onEnd).toHaveBeenCalled();
            nextSpy.andReturn('nextObj');
            sendSpy.andReturn(undefined);
        }));

        it('should call the parser', inject(function(Database){
            expect(parseSpy).toHaveBeenCalledWith(script, jasmine.any(Database));
        }));

        it('should log user responses', function(){
            var logObj = 'logContent';
            task.log(logObj);
            expect(logSpy).toHaveBeenCalledWith(logObj);
        });
    });

    describe('parser', function(){
        var script = {
                pagesSets: [],
                questionsSets: [],
                sequence: []
            },

            db = jasmine.createSpyObj('db', ['createColl', 'add']),
            sequence = jasmine.createSpyObj('sequence', ['add']);


        beforeEach(module('task'));

        beforeEach(inject(function(taskParse){
            taskParse(script, db, sequence);
        }));

        it('should create the appropriate tables for the db', function(){
            expect(db.createColl.argsForCall[0]).toEqual(['pages']);
            expect(db.createColl.argsForCall[1]).toEqual(['questions']);
        });

        it('should add appropriate elements to the tables', function(){
            expect(db.add.argsForCall[0]).toEqual(['pages', script.pagesSets]);
            expect(db.add.argsForCall[1]).toEqual(['questions', script.questionsSets]);
        });
    });

    describe('QuestSequence', function(){
        var sequence, quest, db = jasmine.createSpyObj('db', ['inflate']);

        beforeEach(module('task'));

        beforeEach(inject(function(QuestSequence){
            sequence = function(arr){
                quest = new QuestSequence(arr, db);
            };
        }));

        it('should ', function(){

        });
    });
});