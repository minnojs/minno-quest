import './questTaskModule';

describe('QuestTask',function(){
    var task;
    var createSpy = jasmine.createSpy('create');
    var parseSpy = jasmine.createSpy('parse');
    var nextSpy = jasmine.createSpy('next').and.returnValue('nextObj');
    var script = {sequence:[]};

    // stubout constructors
    beforeEach(module('task', 'database', function($provide) {
        $provide.value('Database', function(){ this.createColl = createSpy; });
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
        expect(task.logger._state).toBeTruthy();
        expect(task.$logSource._state).toBeTruthy();
    }));

    it('should call settings.onEnd at the end of the task (if there is no endObject)', inject(function(QuestTask, $rootScope){
        var script = {
            sequence:[],
            settings: {
                onEnd:jasmine.createSpy('onEnd')
            }
        };
        task = new QuestTask(script);
        nextSpy.and.returnValue(undefined);
        task.current();
        $rootScope.$apply();
        expect(script.settings.onEnd).toHaveBeenCalled();
        nextSpy.and.returnValue('nextObj');
    }));

    it('should call the parser', inject(function(Database){
        expect(parseSpy).toHaveBeenCalledWith(script, jasmine.any(Database));
    }));

    it('should log user responses', function(){
        var logSpy = jasmine.createSpy('logSpy');
        var logObj = ['logContent','more'];
        task.$logSource.map(logSpy);
        task.log.apply(task, logObj);
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

    beforeEach(inject(['taskParse', function(taskParse){
        taskParse(script, db, sequence);
    }]));

    it('should create the appropriate tables for the db', function(){
        expect(db.createColl.calls.argsFor(0)).toEqual(['pages']);
        expect(db.createColl.calls.argsFor(1)).toEqual(['questions']);
    });

    it('should add appropriate elements to the tables', function(){
        expect(db.add.calls.argsFor(0)).toEqual(['pages', script.pagesSets]);
        expect(db.add.calls.argsFor(1)).toEqual(['questions', script.questionsSets]);
    });
});
