define(['underscore','./task-module'],function(){

	describe('Task',function(){
		var task;
		var logSpy = jasmine.createSpy("log");
		var createSpy = jasmine.createSpy('create');
		var parseSpy = jasmine.createSpy('parse');
		var nextSpy = jasmine.createSpy('next');
		var script = {};

		// stubout constructors
		beforeEach(module('task', 'logger','database', function($provide) {
			$provide.value('Logger', function(){
				this.log = logSpy;
			});
			$provide.value('Database', function(){
				this.create = createSpy;
			});
			$provide.value('taskParse',parseSpy);
			$provide.value('Sequence',function(){
				this.proceed = nextSpy;
			});
		}));

		beforeEach(inject(function(Task){
			task = new Task(script);
		}));

		it('should setup the db', inject(function(Database){
			expect(task.db).toBeDefined();
			expect(task.db).toEqual(jasmine.any(Database));
		}));

		it('should setup the sequence', inject(function(Sequence){
			expect(task.sequence).toBeDefined();
			expect(task.sequence).toEqual(jasmine.any(Sequence));
		}));

		it('should call the parser', inject(function(Database){
			expect(parseSpy).toHaveBeenCalledWith(script, jasmine.any(Database), jasmine.any(Object));
		}));

		it('should ask for the next object to display', function(){
			var nextObj = "nextContent";
			task.next(nextObj);
			expect(nextSpy).toHaveBeenCalledWith(nextObj, task.db);
		});

		it('should log user responses', function(){
			var logObj = "logContent";
			task.log(logObj);
			expect(logSpy).toHaveBeenCalledWith(logObj);
		});
	});

	describe('parser', function(){
		var script = {
				pages: {},
				questions: {},
				sequence: {}
			},
			mixedSequence = {}, // place holder for mixed sequence
			db = jasmine.createSpyObj('db', ['create', 'add']),
			sequence = jasmine.createSpyObj('sequence', ['add']),
			mixerSpy = jasmine.createSpy('mixer').andReturn(mixedSequence);

		beforeEach(module('task', function($provide){
			$provide.value('mixer', mixerSpy);
		}));

		beforeEach(inject(function(taskParse){
			taskParse(script, db, sequence);
		}));

		it('should create the appropriate tables for the db', function(){
			expect(db.create.argsForCall[0]).toEqual(['pages']);
			expect(db.create.argsForCall[1]).toEqual(['questions']);
		});

		it('should add appropriate elements to the tables', function(){
			expect(db.add.argsForCall[0]).toEqual(['pages', script.pages]);
			expect(db.add.argsForCall[1]).toEqual(['questions', script.questions]);
		});

		it('should mix sequence', function(){
			expect(mixerSpy).toHaveBeenCalledWith(script.sequence);
		});

		it('should add mixed sequence to sequenceObj', function(){
			expect(sequence.add).toHaveBeenCalledWith(mixedSequence);
		});
	});

	describe('sequence', function(){
		var inflateSpy = jasmine.createSpy('inflate');
		var sequence;
		var db = {};

		beforeEach(module('database','task', function($provide){
			$provide.value('inflate', inflateSpy);
		}));

		beforeEach(inject(function(TaskSequenceProvider){
			sequence = new TaskSequenceProvider([1,2,3,4], db);
		}));

		it('should be an instance of Collection', inject(function(TaskSequenceProvider, Collection){
			expect(sequence).toEqual(jasmine.any(TaskSequenceProvider));
			expect(sequence).toEqual(jasmine.any(Collection));
		}));

		it('should have a db, and throw an exception if its missing', inject(function(TaskSequenceProvider){
			expect(sequence.db).toBeDefined();
			expect(function(){
				new TaskSequenceProvider([]);
			}).toThrow();
		}));

		describe('buildPage', function(){
			console.log('build page tests - depend on the inflate function');
			it('should know how to inflate a page', function(){

			});

			it('should know how to inflate questions', function(){

			});
		});
	});
});