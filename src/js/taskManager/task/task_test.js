define(['require','angular','./taskModule'],function(require, angular){
	describe('task', function(){
		beforeEach(module('pi.task'));

		describe('getScript', function(){
			var url = require.toUrl('.') + '/test/script1.js';
			var p, get, $rootScope;

			beforeEach(inject(function(taskGetScript, _$rootScope_){
				get = taskGetScript;
				$rootScope = _$rootScope_;
			}));

			it('should return a promise', function(){
				p = get(url);
				expect(p.then).toBeDefined();
			});

			// couldn't manage to test this...
			// it('should resolve when a file was found', function(){
			// 	var done = false;
			// 	var success = jasmine.createSpy('success');
			// 	var error = jasmine.createSpy('error');
			// 	p = get(url)
			// 	p.then(success,error);
			// 	p['finally'](function(){done = true;})

			// 	waitsFor(function(){
			// 		$rootScope.$digest();
			// 		return done;
			// 	});

			// 	runs(function(){
			// 		expect(success).toHaveBeenCalledWith({a:1});
			// 		expect(error).not.toHaveBeenCalled();
			// 	});
			// });

			//it('should reject when a file was not found');
			//it('should return the file contents that we requested', function(){	});

			it('should support base_url', function(){
				// not just yet it isn't needed...
			});
		});

		describe('taskLoad', function(){
			var q, taskLoad, $rootScope;

			beforeEach(module(function($provide){
				$provide.value('taskGetScript', function(){
					return q.promise;
				});
			}));

			beforeEach(inject(function($q, _taskLoad_, _$rootScope_){
				$rootScope = _$rootScope_;
				taskLoad = _taskLoad_;
				q = $q.defer();
			}));

			it('should return a resolved promise for a script', function(){
				var script = {test:1};
				var spy = jasmine.createSpy('then');
				taskLoad({script:script}).then(spy);
				$rootScope.$digest();
				expect(spy).toHaveBeenCalledWith(script);
			});

			it('should return an unresolved promise for scriptUrl', function(){
				var script = {test:1};
				var spy = jasmine.createSpy('then');
				taskLoad({scriptUrl:script}).then(spy);
				$rootScope.$digest();
				expect(spy).not.toHaveBeenCalledWith(script);
				q.resolve(script);
				$rootScope.$digest();
				expect(spy).toHaveBeenCalledWith(script);
			});

			it('should throw if both script and scriptUrl are not set', function(){
				expect(function(){
					taskLoad({});
				}).toThrow();
			});
		});

		describe('taskActivate', function(){
			var activate, testSpy;

			beforeEach(module(function(taskActivateProvider){
				testSpy = jasmine.createSpy('test');
				taskActivateProvider.set('test', testSpy);
			}));

			beforeEach(inject(function(taskActivate){
				activate = taskActivate;
			}));

			it('should run a "function" script', function(){
				var spy = jasmine.createSpy('task');
				activate({}, spy, 'el');
				expect(spy).toHaveBeenCalled();
			});

			it('should run a script.play function', function(){
				var spy = jasmine.createSpy('task').andCallFake(function(){
					expect(this).toBe(script);
				});
				var script = {play:spy};
				activate({}, script, 'el');
				expect(spy).toHaveBeenCalled();
			});

			it('should run as script by task.type', function(){
				activate({type:'test'}, {}, 'el');
				expect(testSpy).toHaveBeenCalled();
			});

			it('should resolve when the callback is called', inject(function($rootScope){
				var spy = jasmine.createSpy('then');
				var callback;
				activate({}, function(cb){callback = cb;}, 'el')
					.then(spy);

				$rootScope.$digest();
				expect(spy).not.toHaveBeenCalled();
				callback();
				$rootScope.$digest();
				expect(spy).toHaveBeenCalled();
			}));

		});

		describe('taskDirective', function() {

			var loadDef, endDef, $scope, compile, $elm;

			beforeEach(module(function($provide){
				$provide.value('taskLoad', function(){
					return loadDef.promise;
				});

				$provide.value('taskActivate', function(){
					return endDef.promise;
				});
			}));

			beforeEach(inject(function($compile, $rootScope, $q){
				$elm = angular.element('<div pi-task="task" ></div>');
				loadDef = $q.defer();
				endDef = $q.defer();

				compile = function(task){
					var scope = $rootScope.$new();
					scope.task = task;
					$compile($elm)(scope);
					scope.$digest();

					$scope = $elm.isolateScope();
				};
			}));

			it('should set $script.loading correctly', function(){
				compile({});
				expect($scope.loading).toBeTruthy();
				loadDef.resolve();
				$scope.$digest();
				expect($scope.loading).not.toBeTruthy();
			});

			it('should activate "pre"', function(){
				var spy = jasmine.createSpy('pre');
				compile({pre:spy});

				loadDef.resolve();
				$scope.$digest();
				expect(spy).toHaveBeenCalled();
			});

			it('should activate "post"', function(){
				var spy = jasmine.createSpy('post');
				compile({post:spy});

				loadDef.resolve();
				endDef.resolve();
				$scope.$digest();
				expect(spy).toHaveBeenCalled();
			});

			it('should emit "task:end" at the end of the task', inject(function($rootScope){
				var spy = jasmine.createSpy('post');
				$rootScope.$on('task:end', spy);
				compile({});

				loadDef.resolve();
				endDef.resolve();
				$rootScope.$digest();
				expect(spy).toHaveBeenCalled();
			}));
		});

	});
});