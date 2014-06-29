define(['../questDirectivesModule'],function(){
	var jqLite = angular.element;
	var controller, element, scope, $compile;

	describe('piQuest Controller', function(){
		var script = {name:"myName"};
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
				return {priority: 999,terminal: true};
			});
		}));

		beforeEach(inject(function($injector){
			$compile = $injector.get('$compile');
			var rootScope = $injector.get('$rootScope');
			rootScope.global = {};
			scope = rootScope.$new();
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
			scope.$new().$emit('quest:log', [1], 'currentPageData');
			expect(logSpy).toHaveBeenCalledWith(1, 'currentPageData', scope.global);
		});

		it('should create a local quest object', inject(function($rootScope){
			expect($rootScope.global.myName).toEqual({questions:{}});
			expect(scope.current).toBe($rootScope.global.myName);
		}));
	});

	describe('questHarvest', function(){

		var questions, harvest, scope;
		beforeEach(module('questDirectives'));
		beforeEach(inject(function($rootScope, questHarvest){
			$rootScope.current = {questions:{
				1:{value:1},
				2:{value:2},
				3:{value:3}
			}};

			scope = $rootScope.$new();

			harvest = function(a, b, c){
				questHarvest(scope,a,b,c);
			};
			questions = $rootScope.current.questions;
		}));

		it('should emit the values of all questions on "quest:log"', function(){
			var emited = false;
			scope.$on('quest:log', function(e,logs){
				emited = true;
				expect(logs).toEqual([{value:1},{value:2},{value:3}]);
			});
			harvest();
			expect(emited).toBeTruthy();
		});

		it('should emit all arguments with the logs', function(){
			var emited = false;
			scope.$on('quest:log', function(e,logs,a,b){
				emited = true;
				expect(a).toBe(123);
				expect(b).toBe(345);
			});
			harvest(123,345);
			expect(emited).toBeTruthy();
		});

		it('should mark all questions as logged', function(){
			harvest();
			var i;
			for (i=0; i<questions.length; i++){
				expect(questions[i].logged).toBeTruthy();
			}
		});

		it('should only harvest each question once', function(){
			harvest();

			scope.$on('quest:log', function(e,logs){
				expect(logs.length).toBe(1);
				expect(logs[0].value).toBe(4);
			});
			questions.test = {value:4};
			harvest();
		});
	});

	describe('piqPage', function(){
		var $rootScope;
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
			$provide.value('mixerRecursive', jasmine.createSpy('mixerRecursive').andCallFake(function(a){return a;}));
		}));

		beforeEach(inject(function($injector){
			$compile = $injector.get('$compile');
			$rootScope = $injector.get('$rootScope');
			$rootScope.global = {};
			$rootScope.current = {questions:{}};
			scope = $rootScope.$new();
		}));

		describe('Controller', function(){
			// just create the directive so we can grab the controller
			describe(': general', function(){
				beforeEach(function(){
					compile({name:'myName'});
				});

				it('should create the basic log object', function(){
					expect(controller.log).toBeDefined();
					expect(controller.log.name).toBe('myName');
				});

				it('should mix the questions', inject(function(mixerRecursive){
					expect(mixerRecursive).toHaveBeenCalled();
					expect(scope.questions).toBe(scope.page.questions);
				}));
			});

			describe(': submit', function(){
				var $scope;

				beforeEach(function(){
					compile({});
					spyOn(controller,'harvest');
					$scope = element.scope();
				});

				it('should harvest', function(){
					$scope.submit();
					expect(controller.harvest).toHaveBeenCalled();
				});

				it('should harvest even if there are no questions', inject(function($rootScope){
					$rootScope.current.questions = {};
					$scope.submit();
					expect(controller.harvest).toHaveBeenCalled();
				}));

				it('should not submit if the page is not $valid', function(){
					$scope.pageForm.$setValidity('test', false);
					$scope.submit();
					expect(controller.harvest).not.toHaveBeenCalled();
				});

				it('should not validate if submit(true)', function(){
					$scope.pageForm.$setValidity('test', false);
					$scope.submit(true);
					expect(controller.harvest).toHaveBeenCalled();
				});

				it('should harvest and only then emit "quest:next"', function(){
					var nextSpy = jasmine.createSpy('quest:next');
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

				it('should display numbers only if numbered is set', function(){
					compile({});
					expect(element.find('ol')).toHaveClass('list-unstyled');
					compile({numbered:true});
					expect(element.find('ol')).not.toHaveClass('list-unstyled');
				});
			}); // end describe page directive

			describe('timeout', function(){
				var $timeout;

				beforeEach(inject(function(_$timeout_){
					$timeout = _$timeout_;
					compile({timeout: 100});
				}));

				it('should submit',function(){
					var submitSpy = jasmine.createSpy('submit');
					scope.$on('quest:next', submitSpy);
					$timeout.flush();
					expect(submitSpy).toHaveBeenCalled();
					expect(controller.log.timeout).toBeDefined();
				});

				it('should harvest even upon error', function(){
					var harvestSpy = jasmine.createSpy('harvest');
					scope.pageForm.$setValidity('test', false);

					scope.$on('quest:next', harvestSpy);
					$timeout.flush();
					expect(harvestSpy).toHaveBeenCalled();
				});

				it('should not trigger if submit was called before it', function(){
					scope.submit(true);
					$timeout.flush();
					expect(controller.log.timeout).not.toBeDefined();
				});

				it('should optionally display a timer on the page', function(){});

				it('should show a custom message', function(){});
			});
		});
	});

});