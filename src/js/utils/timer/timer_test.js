define(['./timer-module'], function(){

    describe('timer', function(){
        beforeEach(module('timer'));

        describe('stopper', function(){
            var Stopper, timeStack;

            beforeEach(module(function($provide){
                $provide.value('timerNow', function(){return timeStack.shift();});
            }));
            beforeEach(inject(function(timerStopper){
                Stopper = timerStopper;
            }));

            it('should return time since creation when "now" is called', function(){
                timeStack = [10,20,30];
                var st = new Stopper();
                expect(st.now()).toBe(10);
                expect(st.now()).toBe(20);
            });

        });

        describe('piTimer directive', function(){

            var element, scope, controller, $compile, $timeout, now;

            function compile(){
                element = angular.element('<div pi-timer get-ctrl><div id="filler"></div></div>');
                $compile(element)(scope);
                scope.$digest();
            }

            function advance(time){
                now +=time;
                $timeout.flush(time);
            }

            beforeEach(module(function($provide, $compileProvider){
                $provide.factory('timerNow', function(){
                    now = 0;
                    return function(){return now;};
                });

                $compileProvider.directive('getCtrl', function(){
                    return {
                        require: 'piTimer',
                        link: function(s, e, a, ctrl){
                            controller = ctrl;
                        }
                    };
                });
            }));

            beforeEach(inject(function($injector){
                $compile = $injector.get('$compile');
                $timeout = $injector.get('$timeout');

                scope = $injector.get('$rootScope').$new();
                compile();
            }));

            it('should emit "timer-end" after options.duration seconds', function(){
                var endSpy = jasmine.createSpy('end');
                controller.start({duration: 10, show:false});
                controller.getScope().$on('timer-end', endSpy);
                advance(5000);
                expect(endSpy).not.toHaveBeenCalled();
                advance(5000);
                expect(endSpy).toHaveBeenCalled();
            });

            it('should NOT emit "timer-end" if ctrl.stop was called', function(){
                var endSpy = jasmine.createSpy('end');
                controller.start({duration: 10, show:false});
                controller.getScope().$on('timer-end', endSpy);
                advance(5000);
                controller.stop();
                advance(5000);
                expect(endSpy).not.toHaveBeenCalled();
            });

            it('should expose time on scope', function(){
                controller.start({duration: 90, show:false});
                var scope = controller.getScope();
                advance(90000 - 62017);
                expect(scope.hours).toBe(0);
                expect(scope.minutes).toBe(1);
                expect(scope.seconds).toBe(2);
                expect(scope.milis).toBe(17);
                expect(scope.current).toBe(62017);
            });

            it('should inverse time on scope when options.direction=="up"', function(){
                controller.start({duration: 90, show:false, direction:'up'});
                var scope = controller.getScope();
                advance(62017);
                expect(scope.hours).toBe(0);
                expect(scope.minutes).toBe(1);
                expect(scope.seconds).toBe(2);
                expect(scope.milis).toBe(17);
                expect(scope.current).toBe(62017);
            });

            it('should show the counter if options.show is true', function(){
                controller.start({duration: 10, show:true});
                var $el = element.children('.pi-timer');
                expect($el.length).toBe(1);
            });

            it('should render the time correctly', function(){
                controller.start({duration: 10, show:true, direction:'up'});
                var $el = element.children('.pi-timer');
                advance(2000);
                expect($el.children().text()).toBe('0:02');
            });

            it('should remove element at the end if options.remove=true', function(){
                var $el;
                controller.start({duration: 10, show:true, removeOnEnd:true});

                advance(10000);
                $el = element.children('.pi-timer');
                expect($el.length).toBe(0);
            });

            it('should not remove element at the end if options.remove=false', function(){
                var $el;
                controller.start({duration: 10, show:true, removeOnEnd:false});

                advance(10000);
                $el = element.children('.pi-timer');
                expect($el.length).toBe(1);
            });
        });


    });


});