define(['underscore','./task-module'],function(){

	describe('Task',function(){
		var task;
		var sendSpy = jasmine.createSpy("send");
		var logSpy = jasmine.createSpy("log");
		var createSpy = jasmine.createSpy('create');
		var parseSpy = jasmine.createSpy('parse');
		var nextSpy = jasmine.createSpy('next').andReturn('nextObj');
		var script = {sequence:[]};

		// stubout constructors
		beforeEach(module('task', 'logger','database', function($provide) {
			$provide.value('Logger', jasmine.createSpy('Logger').andCallFake(function(){
				this.send = sendSpy;
				this.log = logSpy;
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

		beforeEach(inject(function(Task, $rootScope){
			$rootScope.current = {questions:{}};
			task = new Task(script);
		}));

		it('should setup the db', inject(function(Database){
			expect(task.db).toBeDefined();
			expect(task.db).toEqual(jasmine.any(Database));
		}));

		it('should setup the sequence', inject(function(QuestSequence){
			expect(task.sequence).toBeDefined();
			expect(task.sequence).toEqual(jasmine.any(QuestSequence));
		}));

		it('should setup the logger', inject(function(Task){
			var script = {
				sequence:[],
				settings: {
					logger:{a:1}
				}
			};
			task = new Task(script);
			expect(task.logger.setSettings).toHaveBeenCalledWith(script.settings.logger);
		}));

		it('should call settings.onEnd at the end of the task (if there is no endObject)', inject(function(Task, $rootScope){
			var script = {
				sequence:[],
				settings: {
					onEnd:jasmine.createSpy('onEnd')
				}
			};
			task = new Task(script);
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
			nextSpy.andReturn('nextObj');
		}));

		it('should call the parser', inject(function(Database){
			expect(parseSpy).toHaveBeenCalledWith(script, jasmine.any(Database));
		}));

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
			expect(db.add.argsForCall[0]).toEqual(['pages', script.pages]);
			expect(db.add.argsForCall[1]).toEqual(['questions', script.questions]);
		});
	});

	describe('TaskSequence', function(){
		var db, sequence, create, templateObj;

		beforeEach(module('task', function($provide){
			$provide.value('templateObj', jasmine.createSpy('templateObj').andCallFake(function(obj){return obj;}));
		}));

		beforeEach(inject(function(TaskSequence, _templateObj_){
			templateObj = _templateObj_;
			db = {
				inflate:jasmine.createSpy('inflate').andCallFake(function(namespace, obj){return obj;})
			};

			create = function(arr){
				return (sequence = new TaskSequence('test', arr, db));
			};
		}));

		it('should return not truthy when no elements are found', function(){
			create([]).next();
			expect(sequence.current()).not.toBeDefined();
		});

		it('should support next/prev', function(){
			create([{test:1},{test:2},{test:3}]).next();
			expect(sequence.current().test).toBe(1);
			sequence.next().next();
			expect(sequence.current().test).toBe(3);
			sequence.prev();
			expect(sequence.current().test).toBe(2);
		});

		it('should support "all"', function(){
			var arr = [{},{},{}];
			create(arr);
			var res = sequence.all();

			for (var i = 0; i < arr.length; i++){
				expect(arr[i]).toBe(res[i]);
			}
		});

		describe(': inflate', function(){
			it('should set the inflated element into $inflated', function(){
				create([{test:1}]);
				var el = sequence.next().current();
				expect(el.$inflated).toBe(el);
				expect(db.inflate).toHaveBeenCalledWith('test',el);
			});

			it('should inflate an element only once', function(){
				create([{test:1}]).next();
				sequence.current();
				sequence.current();
				expect(db.inflate.calls.length).toBe(1);
			});

			it('should inflate multiple times if reinflate = true', function(){
				create([{test:1, reinflate:true}]).next();
				sequence.current();
				sequence.current();
				expect(db.inflate.calls.length).toBe(2);
			});
		});

		describe(': interpolate', function(){
			it('should set the interpolated element into $inflated', function(){
				create([{test:1}]).next();
				var el = sequence.current();
				expect(el.$templated).toBe(el);
				expect(templateObj).toHaveBeenCalledWith(el,jasmine.any(Object));
			});

			it('should interpolate an element only once', function(){
				create([{test:1}]).next();
				sequence.current();
				sequence.current();
				expect(templateObj.calls.length).toBe(1);
			});

			it('should interpolate multiple times if regenerateTemplate = true', function(){
				create([{test:1, regenerateTemplate:true}]).next();
				sequence.current();
				sequence.current();
				expect(templateObj.calls.length).toBe(2);
			});

			it('should extend the context with metaData and elmData', function(){
				create([{test:1, regenerateTemplate:true}]).next();
				sequence.current();
				var context = templateObj.calls[0].args[1];
				expect(context.testMeta).toBeDefined();
				expect(context.testData).toBeDefined();
			});
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