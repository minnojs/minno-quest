define(['require','angular','./taskModule'],function(require, angular){
    describe('task', function(){
        beforeEach(module('pi.task'));

		// taskActivate(task, el, scope)
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
                activate({$script:spy}, 'el', 'scope');
                expect(spy).toHaveBeenCalled();
            });

            it('should run and inject a script.play function', function(){
                var spy = jasmine.createSpy('task').andCallFake(function(){
                    expect(this).toBe(script);
                });
                var script = {play:spy};
                var task = {$script:script};
                spy.$inject = ['task'];
                activate(task, 'el','scope');
                expect(spy).toHaveBeenCalledWith(task);
            });

            it('should run and inject a script.play array/function', function(){
                var spy = jasmine.createSpy('task').andCallFake(function(){
                    expect(this).toBe(script);
                });
                var script = {play:['task',spy]};
                var task = {$script:script};
                activate(task, 'el','scope');
                expect(spy).toHaveBeenCalledWith(task);
            });

            it('should run as script by task.type', function(){
                activate({type:'test'}, 'el', 'scope');
                expect(testSpy).toHaveBeenCalled();
            });

            it('should resolve when the callback is called', inject(function($rootScope){
                var spy = jasmine.createSpy('then');
                var callback;
                activate({$script:function(done){callback = done;}}, 'el', 'scope')
					.promise
					.then(spy);

                $rootScope.$digest();
                expect(spy).not.toHaveBeenCalled();
                callback();
                $rootScope.$digest();
                expect(spy).toHaveBeenCalled();
            }));

            it('should invoke the activator with relevant locals', inject(function($rootScope){
                $rootScope.global = {};
                var spy = jasmine.createSpy('activator');
                var $task;
                function activator($scope, $element, global, task, script){
                    spy();
                    expect($scope).toBe('scope');
                    expect($element).toBe('element');
                    expect(global).toBe($rootScope.global);
                    expect(task).toBe($task);
                    expect(script).toBe($task.$script);
                }
                $task = {$script:activator};

                activate($task, 'element', 'scope');
                expect(spy).toHaveBeenCalled();
            }));

        });

        xdescribe('taskDirective', function() {

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


            it('should activate canvas before task', function(){

            });

            it('should deactivate canvas at the end of the task', function(){

            });

            it('should activate title before task', function(){

            });

            it('should deactivate title at the end of the task', function(){

            });


        });

    });
});