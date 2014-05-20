define(['./piQuest-module','../text/text-module'],function(){

	describe('piQuest Controller', function(){

		var script = {};
		var controller, element, scope, $compile;
		var jqLite = angular.element;
		var logSpy = jasmine.createSpy('log');
		var TaskSpy = jasmine.createSpy('Task').andCallFake(function(){
			this.log = logSpy;
			this.proceed = jasmine.createSpy('proceed').andReturn('nextObj');
		});

		function compile(){
			element = jqLite('<div pi-quest get-ctrl></div>');
			scope.script = script;
			$compile(element)(scope);
			scope.$digest();
		}

		beforeEach(module('piQuest','task', function($provide, $compileProvider){
			$provide.value('Task', TaskSpy);

			// get the piQuest controller
			$compileProvider.directive('getCtrl', function(){
				return {
					require:'piQuest',
					link: function(scope, element, attr, ctrl) {
						controller = ctrl;
					}
				};
			});
		}));

		beforeEach(inject(function($injector) {
			$compile = $injector.get('$compile');
			scope = $injector.get('$rootScope');
		}));

		it('should create a task from the script', inject(function(Task){
			compile();
			expect(controller.task).toEqual(jasmine.any(Task));
			expect(TaskSpy).toHaveBeenCalledWith(script);
		}));

		it('should expose methods to register questions', function(){
			expect(controller.addQuest).toEqual(jasmine.any(Function));
			expect(controller.removeQuest).toEqual(jasmine.any(Function));
		});

		describe(': harvest', function(){
			var valueSpy;


			beforeEach(inject(function(Collection){
				var coll = new Collection([1,2,3,4,5,6]);
				// create mock questions
				valueSpy = jasmine.createSpy('quest').andCallFake(function(){
					return coll.next();
				});

				controller.addQuest({value:valueSpy});
				controller.addQuest({value:valueSpy});
				controller.addQuest({value:valueSpy});
				controller.harvest();
			}));

			it('should log all questions', function(){
				expect(valueSpy.calls.length).toBe(3);
				expect(logSpy).toHaveBeenCalledWith(1);
				expect(logSpy).toHaveBeenCalledWith(2);
				expect(logSpy).toHaveBeenCalledWith(3);
			});

			it('should only harvest each question once', function(){
				controller.harvest();
				expect(valueSpy.calls.length).toBe(3);

				controller.addQuest({value:valueSpy});
				controller.harvest();
				expect(valueSpy.calls.length).toBe(4);
			});
		});


	});


	xdescribe('quest.piQuest',function(){

		var element, scope, currentTask, nextSpy, $compile, $document;
		var jqLite = angular.element;

		var compile = function compile(data){
			var html = '<div pi-quest></div>';
			element = jqLite(html);
			currentTask = data;
			$compile(element)(scope);
			scope.$digest();
		};

		// we need the text module in order to realy test this...
		beforeEach(module('questText'));
		beforeEach(module('quest.piQuest', function($provide) {
			// create spy for next
			nextSpy = jasmine.createSpy('$sequence.next');

			$provide.factory('$sequence', function(){
				return {
					current: currentTask,
					next: nextSpy
				};
			});

		}));

		beforeEach(inject(function($injector) {
			$compile = $injector.get('$compile');
			$document = $injector.get('$document');
			scope = $injector.get('$rootScope');
		}));


		it('should compile the correct number of questions', function(){
			compile({
				questions: [{},{},{}]
			});
			expect(element.find('li').length).toBe(3);
		});

		it('should compile the header', function(){
			compile({
				header: 'My header'
			});

			expect(element.find('h2').text()).toBe('My header');
		});

		it('should be valid only if the question are valid', function(){
			compile({
				questions: [{required:true}]
			});
			expect(element).toBeInvalid();
		});

		it('should not show a header if it doesnt exist', function(){
			compile({});
			expect(element.find('h2').length).toBe(0);
		});

		it('should submit when submit is clicked', function(){
			compile({});
			element.find('[data-role="submit"]').click();
			expect(nextSpy).toHaveBeenCalled();
		});

		it('should not submit when the form is not valid', function(){
			var submitBtn = element.find('[data-role="submit"]');
			compile({});
			scope.form.$setValidity('test');
			scope.$digest();
			submitBtn.click();
			expect(nextSpy).not.toHaveBeenCalled();
		});

	});
});