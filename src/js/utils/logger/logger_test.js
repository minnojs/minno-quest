define(['./logger-module'],function(){

    var $httpBackend, logger, settings = {pulse:3};

    describe('Logger', function(){

        beforeEach(module('logger', function(LoggerProvider){
            LoggerProvider.settings = {
                pulse: 10,
                url:'/url',
                fake: 'fake'
            };
        }));

        beforeEach(inject(function(_$httpBackend_, Logger){
            $httpBackend = _$httpBackend_;
            logger = new Logger();
            logger.setSettings(settings);
        }));

        it('should add logged objects to the stack', function(){
            logger.log(1);
            logger.log(2);
            expect(logger.pending[0]).toBe(1);
            expect(logger.pending[1]).toBe(2);
        });

        describe(': settings', function(){
            it('should have a method that sets "settings"', function(){
                var s = {a:1};
                expect(logger.setSettings).toBeDefined();
                logger.setSettings(s);
                expect(logger.setSettings().a).toBe(1);
            });

            it('should inherit settings (across instances)', function(){
                expect(logger.settings.fake).toBe('fake');
                expect(logger.settings.pulse).not.toBe(10); // make sure not to overide the explicit settings
            });

            it('should throw an error if meta is set and we try to log a non object', inject(function(Logger){
                var l = new Logger({meta:{a:1}});
                expect(function(){
                    logger.log(1234);
                }).not.toThrow();

                expect(function(){
                    l.log(1234);
                }).toThrow();
            }));
        });

        describe(': pulse', function(){
            it('should support send after logging settings.pulse objects', function(){
                spyOn(logger,'send');
                logger.log(1);
                logger.log(2);
                expect(logger.send).not.toHaveBeenCalled();
                logger.log(3);
                expect(logger.send).toHaveBeenCalled();
            });

            it('should not pulse if pulse is not set or set to 0', function(){
                spyOn(logger,'send');

                logger.settings.pulse = 0;
                logger.log(1);
                logger.log(2);
                expect(logger.send).not.toHaveBeenCalled();

                logger.settings.pulse = undefined;
                logger.log(3);
                logger.log(4);
                expect(logger.send).not.toHaveBeenCalled();
            });

            it('should not pulse if suppressPulse was called', function(){
                spyOn(logger,'send');
                logger.suppressPulse();
                logger.log(1);
                logger.log(2);
                logger.log(3);
                expect(logger.send).not.toHaveBeenCalled();
            });

            describe(': suppressPulse', function(){
                it('should set suppress to true by default', function(){
                    logger.suppressPulse();
                    expect(logger.suppress).toBeTruthy();
                });

                it('should set suppress to the argument', function(){
                    logger.suppressPulse(true);
                    expect(logger.suppress).toBeTruthy();
                    logger.suppressPulse(false);
                    expect(logger.suppress).not.toBeTruthy();
                });
            });
        });

        describe(': send', function(){
            beforeEach(function(){
                $httpBackend.when('POST', '/url').respond({});
            });

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });


            it('should post data to settings.url', function(){
                $httpBackend.expectPOST('/url');
                logger.log(1);
                logger.send();
                $httpBackend.flush();
            });

            it('should not post data if there are no pending objects', inject(function($http){
                spyOn($http,'post');
                logger.send();
                expect($http.post).not.toHaveBeenCalled();
            }));

            it('should remove logged objects from the stack and save them after each send', function(){
                logger.log(1);
                logger.log(2);
                logger.log(3);
                expect(logger.sent.length).toBe(3);
                expect(logger.pending.length).toBe(0);
                $httpBackend.flush();
            });

            it('should return a promise', function(){
				// when not logging
                expect(logger.send().then).toEqual(jasmine.any(Function));

				// when logging
                logger.log(1);
                expect(logger.send().then).toEqual(jasmine.any(Function));
                $httpBackend.flush();
            });
        });

        it('should supply a log counter across instances', inject(function(Logger){
            var l1 = new Logger();
            l1.setSettings(settings);
            var l2 = new Logger();
            l2.setSettings(settings);

            expect(l1.getCount()).toBe(0);
            l1.log(123);
            l2.log(123);
            expect(l1.getCount()).toBe(2);
            l2.log(123);
            expect(l1.getCount()).toBe(3);
            expect(l2.getCount()).toBe(3);
        }));

        it('should log an object to the console if DEBUG is set to true', inject(function($log, piConsole){
            piConsole.setSettings({level:'debug'});
            logger.log(123);
            expect($log.debug.logs[0]).toEqual(['Logged: ', 123]);
        }));

        it('should parse the input using logFn if it exists', function(){
            logger.settings.logFn = function(a, b){
                return a + b;
            };
            logger.log(1,2);
            expect(logger.pending[0]).toBe(3);
        });

        it('should use the default log function if it is set (and pass all relevant arguments)', inject(function(Logger){
            var logFn = jasmine.createSpy('logFn').andCallFake(function(a){return a;});
            var l = new Logger(logFn);
            l.log(1,2,3);
            expect(l.pending[0]).toBe(1);
            expect(logFn).toHaveBeenCalledWith(1,2,3);
        }));

        it('should extend the log object with whatever is set in settings.meta',inject(function(Logger){
            var l = new Logger();
            l.setSettings({meta:{a:1}});
            l.log({b:2});
            l.log({c:3});
            expect(l.pending[0]).toEqual({a:1,b:2});
            expect(l.pending[1]).toEqual({a:1,c:3});
        }));
    });

});
