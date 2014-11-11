define(['require','./managerModule'], function(require){
	var angular = require('angular');
	describe('manager', function(){

		beforeEach(module('taskManager'));

		/**
		 * The provider responsible for the relationship between the sequence and the directive.
		 */
		describe('managerService', function(){
			var manager, $scope, loadedQ;

			beforeEach(module(function($provide){
				$provide.service('taskLoad', function($q){
					loadedQ = $q.defer();
					return function(){
						return loadedQ.promise;
					};
				});

				$provide.value('managerSequence', function managerSequence(){
					this.next = jasmine.createSpy('next');
					this.prev = jasmine.createSpy('prev');
					this.current = jasmine.createSpy('current');
				});
			}));

			beforeEach(inject(function($rootScope, managerService){
				$scope = $rootScope.$new();
				manager = managerService($scope, {});
			}));

			it('should return an object (no need for new)', function(){
				expect(manager).toEqual(jasmine.any(Object));
			});

			it('should create a sequence', inject(function(managerSequence){
				expect(manager.sequence).toEqual(jasmine.any(managerSequence));
			}));

			it('should call next on manager:next', function(){
				spyOn(manager, 'next');
				$scope.$emit('manager:next');
				$scope.$digest();
				expect(manager.next).toHaveBeenCalled();
			});

			it('should call prev on manager:prev', function(){
				spyOn(manager, 'prev');
				$scope.$emit('manager:prev');
				$scope.$digest();
				expect(manager.prev).toHaveBeenCalled();
			});

			it('should proceed and load for next', function(){
				spyOn(manager,'load');
				manager.next();
				expect(manager.sequence.next).toHaveBeenCalled();
				expect(manager.load).toHaveBeenCalled();
			});

			it('should proceed and load for prev', function(){
				spyOn(manager,'load');
				manager.prev();
				expect(manager.sequence.prev).toHaveBeenCalled();
				expect(manager.load).toHaveBeenCalled();
			});

			it('should emit manager:loaded after loading is done', function(){
				var spy = jasmine.createSpy('loaded');
				$scope.$on('manager:loaded', spy);
				spyOn(manager,'current');
				manager.current.andReturn({});
				manager.load();

				$scope.$digest();
				expect(spy).not.toHaveBeenCalled();

				loadedQ.resolve();
				$scope.$digest();
				expect(spy).toHaveBeenCalled();
			});

			it('should emit manager:loaded if task is empty (end of sequence)', function(){
				var spy = jasmine.createSpy('loaded');
				$scope.$on('manager:loaded', spy);
				manager.load();

				$scope.$digest();
				expect(spy).toHaveBeenCalled();
			});

		}); // end managerService

		/**
		 * The task sequence itself
		 */
		describe('managerSequence', function(){
			var sequence, script;

			beforeEach(module(function($provide){
				$provide.value('Database', function(){
					this.add = jasmine.createSpy('add');
					this.createColl = jasmine.createSpy('createColl');
				});

				$provide.value('TaskSequence', function(){
					this.args = [arguments[0], arguments[1], arguments[2]];
					this.next = jasmine.createSpy('next');
					this.prev = jasmine.createSpy('prev');
					this.current = jasmine.createSpy('current');
				});
			}));

			beforeEach(inject(function(managerSequence){
				script = {tasks:{},sequence:[]};
				sequence = managerSequence(script);
			}));

			it('should create a db correctly', function(){
				expect(sequence.db).toEqual(jasmine.any(Object));
				expect(sequence.db.createColl).toHaveBeenCalledWith('tasks');
				expect(sequence.db.add).toHaveBeenCalledWith('tasks',script.tasks);
			});

			it('should create a taskSequence correctly', inject(function(TaskSequence){
				expect(sequence.sequence).toEqual(jasmine.any(TaskSequence));
				expect(sequence.sequence.args).toEqual(['tasks', script.sequence, sequence.db]);
			}));

			it('should call next', function(){
				sequence.next();
				expect(sequence.sequence.next).toHaveBeenCalled();
			});

			it('should call prev', function(){
				sequence.prev();
				expect(sequence.sequence.prev).toHaveBeenCalled();
			});

			it('should call current', function(){
				sequence.current();
				expect(sequence.sequence.current).toHaveBeenCalled();
			});
		});

		describe('managerDirective', function(){
			var loadDef, element, $compile, $scope, currentSpy, piSwap;

			function compile(script){
				var scriptTxt = angular.isString(script) ? script : angular.toJson(script || {});
				var html = '<div pi-manager="' + scriptTxt + '"></div>';
				element = angular.element(html);
				$compile(element)($scope);
				loadDef.resolve(script);
				$scope.$digest();
				piSwap = element.controller('piSwap');
			}

			beforeEach(module(function($provide, $compileProvider){

				$compileProvider.directive('piSwap', function(){
					return {
						priority: 9999,
						terminal: true,
						controller: function(){
							this.next = jasmine.createSpy('next');
							this.empty = jasmine.createSpy('empty');
						}
					};
				});

				$provide.value('managerLoad', jasmine.createSpy('managerLoad').andCallFake(function(){
					return loadDef.promise;
				}));

				currentSpy = jasmine.createSpy('current').andReturn({});
				$provide.value('managerService', jasmine.createSpy('managerService').andCallFake(function(){
					this.current = currentSpy;
				}));
			}));

			beforeEach(inject(function($injector){
				loadDef = $injector.get('$q').defer(); // resolved within compile
				$compile = $injector.get('$compile');
				$scope = $injector.get('$rootScope').$new();
			}));

			describe(': setup', function(){
				it('should load a url from attr.piManager', inject(function(managerLoad){
					compile('abc');
					expect(managerLoad).toHaveBeenCalledWith('abc');
				}));

				it('should load an object from attr.piManager', inject(function(managerLoad){
					compile('{a:1}');
					expect(managerLoad).toHaveBeenCalledWith({a:1});
				}));

				it('should create a sequence', inject(function(managerService){
					compile();
					expect(managerService).toHaveBeenCalled();
				}));

				it('should emit manager:next at startup', function(){
					var spy = jasmine.createSpy('next');
					$scope.$on('manager:next', spy);
					compile();
					expect(spy).toHaveBeenCalled();
				});
			});

			describe(': loaded->proceed', function(){

				it('should apply the appropriate post', function(){
					var post = jasmine.createSpy('post');

					compile();

					// should not run at begining of task
					currentSpy.andReturn({post:post});
					$scope.$emit('manager:loaded');
					$scope.$digest();
					expect(post).not.toHaveBeenCalled();

					// should run at the end of the task
					currentSpy.andReturn({});
					$scope.$emit('manager:loaded');
					$scope.$digest();
					expect(post).toHaveBeenCalled();
				});

				it('should apply pre after post', function(){
					var pre = jasmine.createSpy('pre');
					var post = jasmine.createSpy('post').andCallFake(function(){
						expect(pre).not.toHaveBeenCalled();
					});

					compile();

					// execute first task
					currentSpy.andReturn({post:post});
					$scope.$emit('manager:loaded');
					$scope.$digest();

					// execute second task
					currentSpy.andReturn({pre: pre});
					$scope.$emit('manager:loaded');
					$scope.$digest();

					expect(post).toHaveBeenCalled(); // make sure the pre expect was run...
					expect(pre).toHaveBeenCalled();
				});

				it('should call swap.next after pre', function(){
					var pre = jasmine.createSpy('pre').andCallFake(function(){
						expect(piSwap.next).not.toHaveBeenCalled();
					});

					compile();
					currentSpy.andReturn({pre: pre});
					$scope.$emit('manager:loaded');
					$scope.$digest();

					expect(pre).toHaveBeenCalled();
					expect(piSwap.next).toHaveBeenCalled();
				});
			});

			describe(': loaded->done', function(){

				it('should apply the appropriate post', function(){
					var post = jasmine.createSpy('post');

					compile();

					// should not run at begining of task
					currentSpy.andReturn({post:post});
					$scope.$emit('manager:loaded');
					$scope.$digest();
					expect(post).not.toHaveBeenCalled();

					// should run at the end of the task
					currentSpy.andReturn(undefined);
					$scope.$emit('manager:loaded');
					$scope.$digest();
					expect(post).toHaveBeenCalled();
				});

				it('should call swap.emty after post', function(){
					var post = jasmine.createSpy('post').andCallFake(function(){
						expect(piSwap.empty).not.toHaveBeenCalled();
					});

					compile();
					currentSpy.andReturn({post: post});
					$scope.$emit('manager:loaded');
					$scope.$digest();

					currentSpy.andReturn(undefined);
					$scope.$emit('manager:loaded');
					$scope.$digest();

					expect(post).toHaveBeenCalled();
					expect(piSwap.empty).toHaveBeenCalled();
				});

				it('should call manager.onEnd', function(){
					var onEnd = jasmine.createSpy('onEnd').andCallFake(function(){
						expect(piSwap.empty).toHaveBeenCalled();
					});
					compile({onEnd:onEnd});

					currentSpy.andReturn(undefined);
					$scope.$emit('manager:loaded');
					$scope.$digest();
					expect(onEnd).toHaveBeenCalled();
				});

				it('should emit manager:done', function(){
					var onEnd = jasmine.createSpy('onEnd');
					var done = jasmine.createSpy('manager:done').andCallFake(function(){
						expect(onEnd).toHaveBeenCalled();
					});

					compile({onEnd:onEnd});

					currentSpy.andReturn(undefined);
					$scope.$on('manager:done', done);
					$scope.$emit('manager:loaded');
					$scope.$digest();

					expect(done).toHaveBeenCalled();
				});
			});

			describe(': task listeners', function(){

				it('should not propagate manager:next up', inject(function($rootScope){
					var spy = jasmine.createSpy('next');
					compile({});
					$rootScope.$on('manager:next', spy);
					$scope.$emit('task:done');
					expect(spy).toHaveBeenCalled();
				}));

				it('should trigger a manager:next event', function(){
					var spy = jasmine.createSpy('next');
					compile({});
					$scope.$on('manager:next', spy);
					$scope.$emit('task:done');
					expect(spy).toHaveBeenCalled();
				});
			});
		});

		describe('getScript', function(){
			var url = require.toUrl('.') + '/test/script1.js';
			var p, get, $rootScope;

			beforeEach(inject(function(managerGetScript, _$rootScope_){
				get = managerGetScript;
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

			// it('should support base_url', function(){
			// 	// not just yet it isn't needed...
			// });
		});

		describe('managerLoad', function(){
			var def, load, spy, $rootScope;

			beforeEach(module(function($provide){
				$provide.value('managerGetScript', jasmine.createSpy('getScript').andCallFake(function(){return def.promise;}));
			}));

			beforeEach(inject(function($injector){
				$rootScope = $injector.get('$rootScope');
				def = $injector.get('$q').defer();
				load = $injector.get('managerLoad');
				spy = jasmine.createSpy('loaded');
			}));

			it('should return a resolved promise for nonstring', function(){
				load({}).then(spy);
				$rootScope.$digest();
				expect(spy).toHaveBeenCalled();
			});

			it('should getScript the url', inject(function(managerGetScript){
				load('my/url');
				expect(managerGetScript).toHaveBeenCalledWith('my/url');
			}));


			it('should return a promise for a string', function(){
				load('my/url').then(spy);
				$rootScope.$digest();
				expect(spy).not.toHaveBeenCalled();
				def.resolve();
				$rootScope.$digest();
				expect(spy).toHaveBeenCalled();
			});
		});


	}); // end manager
});