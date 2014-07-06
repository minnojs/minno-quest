define(['angular','./questDirectivesModule'], function(angular){

	describe('questController', function(){

		var scope, timerStack, element, $compile, log;

		function compile(data, logObj, options){
			scope.data = data;
			scope.options = options;
			logObj && (scope.current.logObj = logObj);
			element = angular.element('<div quest ng-model="current.logObj" options="options"></div>');
			$compile(element)(scope);
			scope.$digest();
			log = scope.ctrl.log;
		}

		beforeEach(module('questDirectives', function($provide,$compileProvider){
			$provide.value('timerNow', function(){
				return timerStack.shift();
			});

			$compileProvider.directive('quest', function($parse){
				return {
					controller: 'questController',
					controllerAs: 'ctrl',
					require: ['ngModel'],
					link: function(scope, element, attr, ctrls) {
						scope.ctrl.registerModel(ctrls[0], $parse(attr.options)(scope));
					}
				};
			});
		}));

		beforeEach(inject(function($rootScope, _$compile_){
			$rootScope.current = {};
			scope = $rootScope.$new();
			$compile = _$compile_;

			// reset timerStack
			timerStack = [0,0,0,0,0];
		}));

		it('should expose a value function as well as the scope', function(){
			compile({name:123});
			expect(scope.ctrl.registerModel).toBeDefined();
			expect(scope.ctrl.scope).toBe(scope);
			expect(log.name).toEqual(123);
		});

		// view -> model
		it('should bind to a model', inject(function($rootScope){
			compile({});
			expect(log.response).toBeNaN();

			scope.response = 123;
			scope.$digest();
			expect(log.response).toBe(123);
			expect($rootScope.current.logObj).toBe(log);
		}));

		it('should un-decline a question that is answered', function(){
			compile({});
			log.declined = true;
			scope.response = 123;
			scope.$digest();
			expect(log.declined).not.toBeTruthy();
		});

		describe(': defaults', function(){
			it('should use NaN by default', function(){
				// natural default
				compile({});
				expect(log.response).toBeNaN();
				expect(scope.response).toBeNaN();
			});

			it('should try options.dflt', function(){
				// options default
				compile({}, undefined, {dflt:678});
				expect(log.response).toEqual(678);
				expect(scope.response).toBe(log.response);
			});

			it('should try data.dflt', function(){
				// data default
				compile({dflt:345}, undefined, {dflt:456});
				expect(log.response).toBe(345);
				expect(scope.response).toBe(log.response);
			});

			it('should use data.dflt event if it is ""', function(){
				// data default
				compile({dflt:""}, undefined, {dflt:456});
				expect(log.response).toBe("");
			});

		});


		it('should load data from ngModel to overide default', function(){
			compile({dflt:123}, {response:234});
			expect(scope.ctrl.log.response).toBe(234);
		});

		it('should update log latency each time there is a change in scope.response', function(){
			compile({});

			timerStack = [10, 20];

			scope.$digest();

			scope.response = Math.random();
			scope.$digest();
			expect(log.latency).toBe(10);
			expect(log.pristineLatency).toBe(10);

			scope.response = Math.random();
			scope.$digest();
			expect(log.latency).toBe(20);
			expect(log.pristineLatency).toBe(10);
		});
	});

});