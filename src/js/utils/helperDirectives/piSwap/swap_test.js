define(function(require){
    var angular = require('angular');
    var $ = angular.element;

    angular.module('piSwap',['ngAnimateMock']).directive('piSwap', require('./piSwapDirective'));

    describe('piSwap', function(){
        var element, scope, controller, testSpy, $compile;

        function compile(){
            element = $('<div pi-swap get-ctrl><div pi-test></div></div>');
            $compile(element)(scope);
            scope.$digest();
        }

        beforeEach(module('piSwap', function($compileProvider){
            testSpy = jasmine.createSpy('testDirective');
            $compileProvider.directive('piTest', function(){
                return {
                    link: function(){
                        testSpy();
                    }
                };
            });

            $compileProvider.directive('getCtrl', function(){
                return {
                    require: 'piSwap',
                    link: function(s, e, a, ctrl){
                        controller = ctrl;
                    }
                };
            });

        }));

        beforeEach(inject(function($injector){
            $compile = $injector.get('$compile');
            scope = $injector.get('$rootScope').$new();
            compile();
        }));

        it('should start out empty', function(){
            expect(element.children().length).toBe(0);
        });

        it('should start without compiling content', function(){
            expect(testSpy).not.toHaveBeenCalled();
        });

        describe(': next', function(){
            it('should compile the transclude', function(){
                controller.next({});
                expect(element.children('[pi-test]').length).toBe(1);
                expect(testSpy).toHaveBeenCalled();
            });

            it('should remove the old content when ended', function(){
                controller.next({});
                controller.next({});
                expect(element.children().length).toBe(1);
            });

            it('should replace existing content (including new scope)', function(){
                var oldScope, oldEl, newScope, newEl;

                controller.next({});
                oldEl = element.children();
                oldScope = oldEl.scope();
                controller.next({});
                newEl = element.children();
                newScope = newEl.scope();

                expect(oldEl[0]).not.toBe(newEl[0]);
                expect(oldScope).not.toBe(newScope);
            });

            it('should compile transclude only once', function(){
                controller.next({});
                expect(testSpy.calls.length).toBe(1);
            });

            it('should extend newScope with props', function(){
                controller.next({test:123});
                expect(element.children().scope().test).toBe(123);
            });

            it('should call pre before compiling', function(){
                var preSpy = jasmine.createSpy('pre').andCallFake(function(){
                    expect(testSpy).not.toHaveBeenCalled();
                });
                controller.next({}, {pre:preSpy});
                expect(preSpy).toHaveBeenCalled();
            });

			// maybe should call post after leave has finished? both leave and enter?
            it('should call post after compiling', inject(function($animate){
                var postSpy = jasmine.createSpy('post').andCallFake(function(){
                    expect(testSpy).toHaveBeenCalled();
                });
                controller.next({}, {post:postSpy});
                $animate.triggerCallbacks();

                expect(postSpy).toHaveBeenCalled();
            }));
        });

        describe(': empty', function(){
            it('should leave element empty', function(){
                controller.next({});
                controller.empty();
                expect(element.children().length).toBe(0);
            });

            it('should destroy child scopes', function(){
                var spy = jasmine.createSpy('destroy');
                controller.next({});
                element.children().scope().$on('$destroy', spy);
                controller.empty();
                expect(spy).toHaveBeenCalled();
            });
        });

        describe(': refresh', function(){
            it('should not destroy the scope', function(){
                var spy = jasmine.createSpy('$destroy');
                controller.next({});
                var $scope = element.children().scope();
                $scope.$on('$destroy', spy);
                controller.refresh();
                expect(spy).not.toHaveBeenCalled();
            });

            it('should trigger an inner scope refresh', function(){
                var spy = jasmine.createSpy('$watch');
                controller.next({test:123});
                var $scope = element.children().scope();
                $scope.$watch('test', spy);
                controller.refresh({test:456});
                scope.$digest();
                expect(spy).toHaveBeenCalled();
            });
        });
    });
});