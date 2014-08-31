define(['../questDirectivesModule'],function(){
	var jqLite = angular.element;
	var controller, element, scope, $compile;

	describe('piQuest Controller', function(){
		var script = {name:"myName", global: {extendGlobal:true}, current: {extendCurrent:true}};
		var taskSpyObj;
		var TaskSpy = jasmine.createSpy('Task').andCallFake(function(){
			return (taskSpyObj = jasmine.createSpyObj('Task', ['log','next','prev','current']));
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

		afterEach(inject(function(templateDefaultContext, mixerDefaultContext){
			delete(templateDefaultContext.global);
			delete(templateDefaultContext.current);
			delete(templateDefaultContext.questions);
			delete(mixerDefaultContext.global);
			delete(mixerDefaultContext.current);
			delete(mixerDefaultContext.questions);
		}));

		it('should create a task from the script', function(){
			expect(controller.task).toBeDefined();
			expect(TaskSpy).toHaveBeenCalledWith(script);
		});

		it('should listen for "quest:next" and act accordingly', function(){
			scope.$new().$emit('quest:next','nextObj');
			expect(taskSpyObj.next).toHaveBeenCalled();
			expect(taskSpyObj.current).toHaveBeenCalled();
		});

		it('should listen for "quest:prev" and act accordingly', function(){
			scope.$new().$emit('quest:prev');
			expect(taskSpyObj.prev).toHaveBeenCalled();
			expect(taskSpyObj.current).toHaveBeenCalled();
		});

		it('should listen for "quest:refresh" and act accordingly', function(){
			scope.$new().$emit('quest:refresh');
			expect(taskSpyObj.current).toHaveBeenCalled();
		});

		it('should listen for "quest:log" and log accordingly', function(){
			scope.$new().$emit('quest:log', 1, 'currentPageData');
			expect(taskSpyObj.log).toHaveBeenCalledWith(1, 'currentPageData', scope.global);
		});

		it('should create a "current" quest object', inject(function($rootScope){
			expect($rootScope.global.myName).toEqual(jasmine.any(Object));
			expect($rootScope.global.myName.questions).toEqual(jasmine.any(Object));
			expect(scope.current).toBe($rootScope.global.myName);
		}));

		it('should extend the "current" quest object with script.current', function(){
			expect(scope.current.extendCurrent).toBeTruthy();
		});

		it('should extend the "globa" object with script.global', function(){
			expect(scope.global.extendGlobal).toBeTruthy();
		});

		it('should setup the templateDefaultContext', inject(function(templateDefaultContext){
			expect(templateDefaultContext.global).toBe(scope.global);
			expect(templateDefaultContext.current).toBe(scope.current);
			expect(templateDefaultContext.questions).toBe(scope.current.questions);
		}));

		it('should setup the mixerDefaultContext', inject(function(mixerDefaultContext){
			expect(mixerDefaultContext.global).toBe(scope.global);
			expect(mixerDefaultContext.current).toBe(scope.current);
			expect(mixerDefaultContext.questions).toBe(scope.current.questions);
		}));

	});

	describe('piqPage', function(){
		var $rootScope,scope;
		function compile(data){
			element = jqLite('<div piq-page></div>');
			scope.page = data;
			$compile(element)(scope);
			scope.$digest();
			controller = element.controller('piqPage');
		}

		beforeEach(module('task', 'questDirectives', function($provide, $sceProvider){
			// don't load Task currently
			$provide.value('Task', function(){});
			$sceProvider.enabled(false);
		}));

		beforeEach(inject(function($injector){
			$compile = $injector.get('$compile');
			$rootScope = $injector.get('$rootScope');
			$rootScope.current = {questions:{}};
			$rootScope.global = {current: $rootScope.current};
			scope = $rootScope.$new();
		}));

		describe('Controller', function(){
			it('should create the basic log object', function(){
				compile({name:'myName'});
				expect(controller.log).toBeDefined();
				expect(controller.log.name).toBe('myName');
			});

			it('should submit when `quest:submit:now` is $emited', function(){
				compile({});
				spyOn(scope, 'submit');
				scope.$new().$emit('quest:submit:now');
				expect(scope.submit).toHaveBeenCalled();
			});

			// it('should setup page, when page changes', function(){
			// });

			it('should refresh page when questions is changed', function(){
				var refresh = jasmine.createSpy('refresh');
				compile({});
				scope.$on('quest:refresh', refresh);
				scope.$digest();
				expect(refresh).not.toHaveBeenCalled();
				$rootScope.current.questions.test = true;
				scope.$digest();
				expect(refresh).toHaveBeenCalled();
			});

			describe(': proceed', function(){
				var $scope;

				beforeEach(function(){
					compile({});
					spyOn(controller,'harvest');
					$scope = element.scope();
				});

				it('should harvest', function(){
					controller.proceed();
					expect(controller.harvest).toHaveBeenCalled();
				});

				it('should harvest even if there are no questions', inject(function($rootScope){
					$rootScope.current.questions = {};
					controller.proceed();
					expect(controller.harvest).toHaveBeenCalled();
				}));
			}); // end describe page controller

			describe(': submit', function(){
				var $scope;

				beforeEach(function(){
					compile({});
					$scope = element.scope();
					spyOn(controller, 'proceed');
				});

				it('should proceed if the page is $valid', function(){
					$scope.pageForm.$setValidity('test', true);
					$scope.submit();
					expect(controller.proceed).toHaveBeenCalled();
				});

				it('should not proceed if the page is not $valid', function(){
					$scope.pageForm.$setValidity('test', false);
					$scope.submit();
					expect(controller.proceed).not.toHaveBeenCalled();
				});

				it('should not validate if submit(true)', function(){
					$scope.pageForm.$setValidity('test', false);
					$scope.submit(true);
					expect(controller.proceed).toHaveBeenCalled();
				});

				it('should broadcast quest:submit', function(){
					var spy = jasmine.createSpy('submit');
					$scope.$on('quest:submit', spy);
					$scope.submit(true); // don't mess around with validation
					expect(spy).toHaveBeenCalled();
				});

				it('should broadcast quest:next', function(){
					var spy = jasmine.createSpy('next');
					$scope.$on('quest:next', spy);
					$scope.submit(true); // don't mess around with validation
					expect(spy).toHaveBeenCalled();
				});
			});

			describe(': prev', function(){
				var $scope;

				beforeEach(function(){
					compile({});
					$scope = element.scope();
					spyOn(controller, 'proceed');
				});

				it('should proceed', function(){
					$scope.prev();
					expect(controller.proceed).toHaveBeenCalled();
				});

				it('should broadcast quest:prev', function(){
					var spy = jasmine.createSpy('quest:prev');
					$scope.$on('quest:prev', spy);
					$scope.prev();
					expect(spy).toHaveBeenCalled();
				});
			});

			describe(': decline', function(){
				var $scope;

				beforeEach(function(){
					compile({
						questions: [{name:'newQ'}]
					});
					$scope = element.scope();
					$scope.current.questions.old = {};
					spyOn(controller, 'proceed');
				});

				it('should proceed, even if page is not valid', function(){
					$scope.pageForm.$setValidity('test', false);
					$scope.decline();
					expect(controller.proceed).toHaveBeenCalled();
				});

				it('should broadcast quest:declined', function(){
					var spy = jasmine.createSpy('decline');
					$scope.$on('quest:decline', spy);
					$scope.decline();
					expect(spy).toHaveBeenCalled();
				});

				it('should broadcast quest:next', function(){
					var spy = jasmine.createSpy('next');
					$scope.$on('quest:next', spy);
					$scope.submit(true); // don't mess around with validation
					expect(spy).toHaveBeenCalled();
				});
			});


			describe(': harvest', function(){

				var harvest, spy;
				beforeEach(inject(function($rootScope){
					$rootScope.current = {questions:{}};
					spy = jasmine.createSpy('quest:log');
					scope.$on('quest:log',spy);

					harvest = function(pQuestions, questions){
						compile({questions:pQuestions||[]});
						angular.extend($rootScope.current.questions, questions || {});
						controller.harvest(true); // set lognow to true
					};
				}));

				it('should not harvest nameless questions', function(){
					/* jshint ignore:start */
					var q = {"":{},undefined:{}};
					var p = [{},{name:""},{name:undefined}];
					harvest(p,q);
					expect(spy).not.toHaveBeenCalled();
					/* jshint ignore:end */
				});

				it('should harvest only questions marked with lognow', inject(function($rootScope){
					var q = {1:{}};
					var p = [{name:1, lognow:true}, {name:2, lognow:false}];

					compile({questions:p});
					angular.extend($rootScope.current.questions, q || {});
					controller.harvest(false); // set lognow to false

					expect(spy.calls.length).toBe(1);
				}));

				it('should emit the values of all questions on page uppon "quest:log"', function(){
					var q = {1:{},2:{}};
					var p = [{name:1},{name:2}];
					harvest(p,q);
					expect(spy.calls[0].args[1]).toBe(q[1]);
					expect(spy.calls[1].args[1]).toBe(q[2]);
				});

				it('should emit all arguments with the page log', function(){
					var q = {1:{},2:{}};
					var p = [{name:1},{name:2}];
					harvest(p,q);
					expect(spy.calls[0].args[2]).toBe(controller.log);
				});

				it('should log only active questions', function(){
					var q = {1:{},2:{}};
					var p = [{name:1}];

					harvest(p,q);
					expect(spy.calls.length).toBe(1);
					expect(spy.calls[0].args[1]).toBe(q[1]);
				});

				it('should mark (only) logged questions', function(){
					var q = {1:{},2:{}};
					var p = [{name:1}];

					harvest(p,q);
					expect(q[1].$logged).toBeTruthy();
					expect(q[2].$logged).not.toBeTruthy();
				});

				it('should only harvest each question once', function(){
					var q = {1:{$logged:true},2:{$logged:true}};
					var p = [{name:1},{name:2}];
					harvest(p,q);
					expect(spy).not.toHaveBeenCalled();
				});

			});


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

					expect(element.find('h3').text()).toBe('My header');
				});

				it('should style the header', function(){
					compile({
						header: 'My header',
						headerStyle: {'z-index':'123'}
					});

					expect(element.find('h3').css('z-index')).toEqual('123');
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

				describe(': prev', function () {
					it('should not display the prev button by default', function() {
						var el;
						compile({$meta: {number:3}});
						el = element.find('[ng-click="prev()"]');
						expect(el.length).toBe(0);
					});

					it('should not display the prev button on the first page', function() {
						var el;
						compile({$meta: {number:1}});
						el = element.find('[ng-click="prev()"]');
						expect(el.length).toBe(0);
					});

					it('should display the prev button', function() {
						var el;
						compile({prev:true, $meta: {number:3}});
						el = element.find('[ng-click="prev()"]');
						expect(el.length).toBe(1);
					});
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