define(['../questDirectivesModule'],function(){
	var jqLite = angular.element;
	var controller, element, scope, $compile;

	describe('piQuest Controller', function(){
		var script = {};
		var logSpy = jasmine.createSpy('log');
		var nextSpy = jasmine.createSpy('next').andReturn('nextObj');
		var TaskSpy = jasmine.createSpy('Task').andCallFake(function(){
			this.log = logSpy;
			this.next = nextSpy;
		});

		function compile(){
			element = jqLite('<div pi-quest></div>');
			scope.script = script;
			$compile(element)(scope);
			scope.$digest();
			controller = element.controller('piQuest');
		}

		beforeEach(module('questDirectives','task', function($provide, $compileProvider){
			$provide.value('Task', TaskSpy);

			// make sure piqPage is not activated
			$compileProvider.directive('piqPage', function(){
				return {
					priority: 999,
					terminal: true
				};
			});
		}));

		beforeEach(inject(function($injector){
			$compile = $injector.get('$compile');
			scope = $injector.get('$rootScope').$new();
			compile();
		}));

		it('should create a task from the script', inject(function(Task){
			expect(controller.task).toEqual(jasmine.any(Task));
			expect(TaskSpy).toHaveBeenCalledWith(script);
		}));

		it('should listen for "quest:next" and next accordingly', function(){
			scope.$new().$emit('quest:next','nextObj');
			expect(nextSpy).toHaveBeenCalledWith('nextObj');
			expect(element.scope().page).toBe('nextObj');
		});

		it('should listen for "quest:log" and log accordingly', function(){
			scope.global = 'global';
			scope.$new().$emit('quest:log', [1], 'currentPageData');
			expect(logSpy).toHaveBeenCalledWith(1, 'currentPageData', 'global');
		});
	});

	describe('piqPage', function(){
		function compile(data){
			element = jqLite('<div piq-page></div>');
			scope.page = data;
			$compile(element)(scope);
			scope.$digest();
			controller = element.controller('piqPage');
		}

		beforeEach(module('task', 'questDirectives', function($provide){
			// don't load Task currently
			$provide.value('Task', function(){});
		}));

		beforeEach(inject(function($injector){
			$compile = $injector.get('$compile');
			scope = $injector.get('$rootScope').$new();
		}));

		describe('Controller', function(){
			// just create the directive so we can grab the controller
			beforeEach(function(){
				compile({});
			});

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
				}));

				it('should emit the values of all questions on "quest:log"', function(){
					scope.$on('quest:log', function(e,logs){
						expect(logs).toEqual([1,2,3]);
					});
					controller.harvest();
				});

				it('should only harvest each question once', function(){
					controller.harvest();
					expect(valueSpy.calls.length).toBe(3);

					controller.addQuest({value:valueSpy});
					controller.harvest();
					expect(valueSpy.calls.length).toBe(4);
				});
			});

			describe(': submit', function(){
				var $scope;

				beforeEach(function(){
					spyOn(controller,'harvest');
					$scope = element.scope();
				});

				it('should not submit if the page is not $valid', function(){
					controller.addQuest({valid:function(){return true;}});
					controller.addQuest({valid:function(){return false;}});
					controller.addQuest({valid:function(){return true;}});
					$scope.submit();
					expect(controller.harvest).not.toHaveBeenCalled();
				});

				it('should not validate if submit(true)', function(){
					controller.addQuest({valid:function(){return true;}});
					controller.addQuest({valid:function(){return false;}});
					controller.addQuest({valid:function(){return true;}});
					$scope.submit(true);
					expect(controller.harvest).toHaveBeenCalled();
				});

				it('should harvest even when there are no questions registered', function(){
					$scope.submit();
					expect(controller.harvest).toHaveBeenCalled();
				});

				it('should harvest and then emit "quest:next" when submit is called', function(){
					var nextSpy = jasmine.createSpy('quest:next');
					controller.addQuest({valid:function(){return true;}});
					$scope.$on('quest:next', nextSpy);
					$scope.submit();
					expect(nextSpy).toHaveBeenCalled();
					expect(controller.harvest).toHaveBeenCalled();
				});
			}); // end describe page controller

			describe('directive',function(){
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
			}); // end describe page directive
		});
	});

});