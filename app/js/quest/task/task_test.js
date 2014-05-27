define(['underscore','./task-module'],function(){

	describe('Task',function(){
		var task;
		var logSpy = jasmine.createSpy("log");
		var createSpy = jasmine.createSpy('create');
		var parseSpy = jasmine.createSpy('parse');
		var nextSpy = jasmine.createSpy('next').andReturn('nextObj');
		var script = {};

		// stubout constructors
		beforeEach(module('task', 'logger','database', function($provide) {
			$provide.value('Logger', function(){
				this.log = logSpy;
			});
			$provide.value('Database', function(){
				this.createColl = createSpy;
			});
			$provide.value('taskParse',parseSpy);
			$provide.value('TaskSequence',function(){
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

		it('should setup the sequence', inject(function(TaskSequence){
			expect(task.sequence).toBeDefined();
			expect(task.sequence).toEqual(jasmine.any(TaskSequence));
		}));

		it('should call the parser', inject(function(Database){
			expect(parseSpy).toHaveBeenCalledWith(script, jasmine.any(Database), jasmine.any(Object));
		}));

		it('should ask for the next object to display', function(){
			var nextObj = "nextContent";
			var result = task.next(nextObj);
			expect(result).toBe('nextObj');
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
			db = jasmine.createSpyObj('db', ['createColl', 'add']),
			sequence = jasmine.createSpyObj('sequence', ['add']),
			mixerSpy = jasmine.createSpy('mixer').andReturn(mixedSequence);

		beforeEach(module('task', function($provide){
			$provide.value('mixer', mixerSpy);
		}));

		beforeEach(inject(function(taskParse){
			taskParse(script, db, sequence);
		}));

		it('should create the appropriate tables for the db', function(){
			expect(db.createColl.argsForCall[0]).toEqual(['pages']);
			expect(db.createColl.argsForCall[1]).toEqual(['questions']);
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
		var db = jasmine.createSpyObj('db', ['inflate']);
		var sequence;

		beforeEach(module('task'));
		beforeEach(inject(function(TaskSequence){
			sequence = new TaskSequence([1,2,3,4], db);
		}));

		it('should be an instance of Collection and of Sequence', inject(function(TaskSequence, Collection){
			expect(sequence).toEqual(jasmine.any(TaskSequence));
			expect(sequence).toEqual(jasmine.any(Collection));
		}));

		it('should have a db, and throw an exception if its missing', inject(function(TaskSequence){
			expect(sequence.db).toBe(db);
			expect(function(){
				new TaskSequence([]);
			}).toThrow();
		}));

		describe(': buildPage', function(){
			it('should know how to inflate a page', function(){
				var page = {};
				db.inflate.andReturn(page); // make sure the inflate function gets a page too
				sequence.buildPage(page);
				expect(db.inflate).toHaveBeenCalledWith('pages',page);
			});

			it('should know how to inflate questions', function(){
				var questions = [1,2,3];
				var page = {questions:questions};
				db.inflate.andReturn(page); // make sure the inflate function gets a page too
				sequence.buildPage(page);

				expect(db.inflate).toHaveBeenCalledWith('questions',1);
				expect(db.inflate).toHaveBeenCalledWith('questions',2);
				expect(db.inflate).toHaveBeenCalledWith('questions',3);
			});
		});

		describe(': proceed', function(){
			it('should return an infalted version of the next obj', function(){
				spyOn(sequence,'buildPage').andCallFake(function(value){return value;});

				expect(sequence.proceed()).toBe(1);
				expect(sequence.buildPage).toHaveBeenCalledWith(1);
				expect(sequence.proceed()).toBe(2);
				expect(sequence.buildPage).toHaveBeenCalledWith(2);
			});
		});

	});
});