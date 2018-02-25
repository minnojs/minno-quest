define(['require','./managerModule'], function(require){
    var angular = require('angular');
    describe('manager', function(){

        beforeEach(module('taskManager'));

		/**
		 * The provider responsible for the relationship between the sequence and the directive.
		 */
        describe('managerService', function(){
            var manager, $scope, loadedQ, canvasOff;

            beforeEach(module(function($provide){
                $provide.service('managerTaskLoad', function($q){
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

                $provide.value('managerCanvas', jasmine.createSpy('canvas').andCallFake(function(){
                    return (canvasOff = jasmine.createSpy('canvasOff'));
                }));

                $provide.value('piPreloadImages', jasmine.createSpy('preload'));
            }));

            beforeEach(inject(function($rootScope, managerService){
                $rootScope.global = {};
                $scope = $rootScope.$new();
                manager = managerService($scope, {});
            }));

            afterEach(function(){
                $scope.$destroy();
            });

            it('should return an object (no need for new)', function(){
                expect(manager).toEqual(jasmine.any(Object));
            });

            it('should create a sequence', inject(function(managerSequence){
                expect(manager.sequence).toEqual(jasmine.any(managerSequence));
            }));

            it('should preload images', inject(function(piPreloadImages, managerService){
                var images = [1,2,3];
                manager = managerService($scope, {settings:{preloadImages:images}});
                expect(piPreloadImages).toHaveBeenCalledWith(images);
            }));

            it('should set title if it exists', inject(function($document,managerService){
                manager = managerService($scope, {settings:{title:'test123'}});
                expect($document[0].title).toBe('test123');
            }));

            it('should activate canvas', inject(function(managerCanvas){
                expect(managerCanvas).toHaveBeenCalled();
            }));

            it('should remove canvas on $destroy', function(){
                $scope.$destroy();
                expect(canvasOff).toHaveBeenCalled();
            });

            it('should call next on manager:next', function(){
                spyOn(manager, 'next');
                spyOn(manager, 'prev');
                spyOn(manager, 'load');

                $scope.$emit('manager:next');
                $scope.$digest();
                expect(manager.next).toHaveBeenCalled();

                $scope.$emit('manager:next',{type:'prev'});
                $scope.$digest();
                expect(manager.prev).toHaveBeenCalled();

                $scope.$emit('manager:next',{type:'current'});
                $scope.$digest();
                expect(manager.load).toHaveBeenCalled();
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
                    this.sequence = jasmine.createSpy('sequence').andCallFake(function(){
                        return jasmine.createSpyObj('sequence',['next','prev','current']);
                    });
                });

                $provide.constant('mixerDefaultContext', {});
                $provide.constant('templateDefaultContext', {});
            }));

            beforeEach(inject(function(managerSequence){
                script = {taskSets:[],sequence:[]};
                sequence = managerSequence(script);
            }));

            it('should create a db correctly', function(){
                expect(sequence.db).toEqual(jasmine.any(Object));
                expect(sequence.db.createColl).toHaveBeenCalledWith('tasks');
                expect(sequence.db.add).toHaveBeenCalledWith('tasks',script.taskSets);
            });

            it('should create a sequence', function(){
                expect(sequence.db.sequence).toHaveBeenCalledWith('tasks',script.sequence);
            });

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
                    this.setBaseUrl = angular.noop;
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

                it('should invoke onPreTask with task info', function(){
                    var preTask = jasmine.createSpy('preTask');
                    var task = {name:'123'};

                    preTask.$inject = ['currentTask'];

                    compile();
                    $scope.settings = {onPreTask: preTask};

					// should not run at begining of task
                    currentSpy.andReturn(task);
                    $scope.$emit('manager:loaded');
                    $scope.$digest();
                    expect(preTask).toHaveBeenCalledWith(task);
                });

                it('should apply post after preTask', function(){
                    var post = jasmine.createSpy('post');
                    var preTask = jasmine.createSpy('preTask').andCallFake(function(){
                        expect(post).not.toHaveBeenCalled();
                    });

                    compile();

					// execute first task
                    currentSpy.andReturn({post:post});
                    $scope.settings = {onPreTask:preTask};
                    $scope.$emit('manager:loaded');
                    $scope.$digest();

                    $scope.$emit('manager:loaded');
                    $scope.$digest();

                    expect(post).toHaveBeenCalled(); // make sure the pre expect was run...
                    expect(preTask).toHaveBeenCalled();
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

                it('should call swap.empty after post', function(){
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
                    compile();
                    $scope.settings = {onEnd:onEnd}; // the compile function isn't flexible enough to accept functions

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

                    compile();
                    $scope.settings = {onEnd:onEnd}; // the compile function isn't flexible enough to accept functions

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
                    var args = {};
                    compile({});
                    $scope.$on('manager:next', spy);
                    $scope.$emit('task:done', args);
                    expect(spy).toHaveBeenCalledWith(jasmine.any(Object), args);
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

        describe('managerTaskLoad', function(){
            var q, taskLoad, $rootScope;

            beforeEach(module(function($provide){
                $provide.value('managerGetScript', function(){
                    return q.promise;
                });
            }));

            beforeEach(inject(function($q, _managerTaskLoad_, _$rootScope_){
                $rootScope = _$rootScope_;
                taskLoad = _managerTaskLoad_;
                q = $q.defer();
            }));

            it('should return a resolved promise for a script', function(){
                var script = {test:1};
                var spy = jasmine.createSpy('then');
                taskLoad({script:script}).then(spy);
                $rootScope.$digest();
                expect(spy).toHaveBeenCalled();
            });

            it('should return an unresolved promise for scriptUrl', function(){
                var script = {test:1};
                var spy = jasmine.createSpy('then');
                taskLoad({scriptUrl:script}).then(spy);
                $rootScope.$digest();
                expect(spy).not.toHaveBeenCalled();
                q.resolve(script);
                $rootScope.$digest();
                expect(spy).toHaveBeenCalled();
            });

            it('should throw if a scriptUrl is undefined', function(){
                expect(function(){
                    taskLoad({scriptUrl: 123});
                    q.resolve(undefined);
                    $rootScope.$digest();
                }).toThrow();
            });

            it('should extend the task with $script and $template', function(){
                var task = {script:123, template: 345};
                taskLoad(task);
                $rootScope.$digest();
                expect(task.$script).toBe(123);
                expect(task.$template).toBe(345);
            });
        });


    }); // end manager
});
